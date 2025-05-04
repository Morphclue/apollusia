import {
  checkParticipant,
  CreateParticipantDto,
  Participant,
  Poll,
  PollDto,
  PollEvent,
  PollEventDto,
  ReadParticipantDto,
  ReadPollDto,
  ReadPollEventDto,
  ReadStatsPollDto,
  ShowResultOptions,
  UpdateParticipantDto,
} from '@apollusia/types';
import {UserToken} from '@mean-stream/nestx/auth';
import {notFound} from '@mean-stream/nestx/not-found';
import {Doc} from '@mean-stream/nestx/ref';
import {Injectable, Logger, UnprocessableEntityException} from '@nestjs/common';
import {Document, QueryOptions, Types} from 'mongoose';

import {KeycloakUser} from '../auth/keycloak-user.interface';
import {KeycloakService} from '../auth/keycloak.service';
import {environment} from '../environment';
import {renderDate} from '../mail/helpers';
import {MailService} from '../mail/mail/mail.service';
import {ParticipantService} from '../participant/participant.service';
import {PollEventService} from '../poll-event/poll-event.service';
import {PollLogService} from '../poll-log/poll-log.service';
import {PushService} from '../push/push.service';
import {PollService} from './poll.service';

@Injectable()
export class PollActionsService {
  private logger = new Logger(PollActionsService.name);
  private handleError = (err: Error) => this.logger.error(err.message, err.stack);

  constructor(
    private mailService: MailService,
    private pushService: PushService,
    private pollService: PollService,
    private pollEventService: PollEventService,
    private pollLogService: PollLogService,
    private participantService: ParticipantService,
    private keycloakService: KeycloakService,
  ) {
  }

  async getParticipatedPolls(token: string, options?: QueryOptions<Poll>): Promise<ReadStatsPollDto[]> {
    const pollIds = await this.participantService.distinct('poll', {token});
    return this.pollService.findAll({
      _id: {$in: pollIds},
    }, options) as any;
  }

  async postPoll(pollDto: PollDto, user?: UserToken): Promise<ReadPollDto> {
    return this.pollService.create({
      ...pollDto,
      id: undefined!, // required to pass type check, but ignored
      createdBy: user?.sub,
    });
  }

  async clonePoll(id: Types.ObjectId): Promise<ReadPollDto | null> {
    const poll = await this.pollService.find(id) ?? notFound(id);
    const {_id, id: _, title, ...rest} = poll.toObject();
    const pollEvents = await this.pollEventService.findAll({poll: id});
    const clonedPoll = await this.postPoll({
      ...rest,
      title: `${title} (clone)`,
    });
    await this.pollEventService.createMany(pollEvents.map(({start, end, note}) => ({
      poll: clonedPoll._id,
      start,
      end,
      note,
    })));
    return clonedPoll;
  }

  async deletePoll(id: Types.ObjectId): Promise<ReadPollDto | null> {
    const poll = await this.pollService.delete(id);
    await this.pollEventService.deleteMany({poll: id});
    await this.participantService.deleteMany({poll: id});
    return poll;
  }

  async getEvents(id: Types.ObjectId): Promise<ReadPollEventDto[]> {
    const [events, participants] = await Promise.all([
      this.pollEventService.findAll({poll: id}, {sort: {start: 1}}),
      this.participantService.findAll({poll: id}),
    ]);
    return events.map(event => ({
      ...event.toObject(),
      participants: participants.filter(participant => {
        const selection = participant.selection[event._id.toString()];
        return selection && ['yes', 'maybe'].includes(selection);
      }).length,
    }));
  }

  async postEvents(poll: Types.ObjectId, newEvents: PollEventDto[], user?: UserToken): Promise<PollEvent[]> {
    const pollDoc = await this.pollService.find(poll) ?? notFound(poll);
    const oldEvents = await this.pollEventService.findAll({poll});

    // Step 1: collect which events are created, updated and deleted
    const createEvents = newEvents
      .filter(event => !oldEvents.some(oldEvent => oldEvent._id.equals(event._id)));
    const updateEvents: Doc<PollEvent>[] = [];
    const deleteEvents: Doc<PollEvent>[] = [];

    const clearParticipation: Types.ObjectId[] = [];
    for (const event of oldEvents) {
      const updated = newEvents.find(e => event._id.equals(e._id));
      if (updated) {
        if (event.start.valueOf() !== updated.start.valueOf() || event.end.valueOf() !== updated.end.valueOf()) {
          // The event has changed time, clear participation
          clearParticipation.push(event._id);
        }
        event.set(updated);
        updateEvents.push(event);
      } else {
        // mark deleted
        clearParticipation.push(event._id);
        deleteEvents.push(event);
      }
    }

    // Step 2: Apply changes to events
    const createdEvents = await this.pollEventService.createMany(
      createEvents.map(event => ({...event, poll}))
    );
    await this.pollEventService.saveAll(updateEvents);
    await this.pollEventService.deleteAll(deleteEvents);

    // Step 4: Clear selection of participants for relevant events
    await this.removeParticipations(poll, clearParticipation);

    // Step 5: Log the changes
    if (pollDoc.settings.logHistory) {
      await this.pollLogService.create({
        poll,
        createdBy: user?.sub,
        type: 'events.changed',
        data: {created: createdEvents.length, updated: updateEvents.length, deleted: deleteEvents.length},
      });
    }

    // Step 6: Notify participants about the changes
    for await (const participant of this.participantService.model.find({
      poll,
      createdBy: {$exists: true},
    })) {
      this.sendPollChangeNotification(pollDoc, participant).catch(this.handleError);
    }

    // Return the new list of events
    return [...createdEvents, ...updateEvents];
  }

  private async sendPollChangeNotification(poll: Doc<Poll>, participant: Doc<Participant>) {
    const kcUser = await this.keycloakService.getUser(participant.createdBy!);
    if (!kcUser) {
      return;
    }

    if (kcUser.email && this.pushService.hasNotificationEnabled(kcUser, 'user:poll.updated:email')) {
      await this.mailService.sendMail(participant.name, kcUser.email, `Updates in Poll: ${poll.title}`, 'poll-updated', {
        poll: poll.toObject(),
        participant: participant.toObject(),
      });
    }
    if (this.pushService.hasNotificationEnabled(kcUser, 'user:poll.updated:push')) {
      await this.pushService.send(
        kcUser,
        `Updates in Poll: ${poll.title}`,
        'The poll was updated with new or changed options. Please review your choices.',
        `${environment.origin}/poll/${poll._id}/participate`,
      );
    }
  }

  private async removeParticipations(poll: Types.ObjectId, events: Types.ObjectId[]) {
    if (!events.length) {
      return;
    }
    const filter = {
      poll,
      $or: events.map(e => ({[`selection.${e}`]: {$exists: true}})),
    };
    await this.participantService.updateMany(filter, {
      $unset: events.reduce((acc, e) => ({...acc, [`selection.${e}`]: true}), {})
    }, {timestamps: false});
  }

  async getParticipants(id: Types.ObjectId, token: string, user?: UserToken): Promise<ReadParticipantDto[]> {
    const poll = await this.pollService.find(id) ?? notFound(id);
    const currentParticipant = await this.participantService.getOwn(id, token, user);

    if (this.canViewResults(poll, token, user, currentParticipant.length > 0)) {
      const participants = await this.participantService.findAll({
        poll: id,
        _id: {$nin: currentParticipant.map(p => p._id)},
      });
      return [...participants, ...currentParticipant];
    }

    return currentParticipant;
  }

  private canViewResults(poll: Poll, token: string, user: UserToken | undefined, currentParticipant: boolean) {
    if (this.pollService.isAdmin(poll, token, user?.sub)) {
      return true;
    }
    switch (poll.settings.showResult) {
      case ShowResultOptions.IMMEDIATELY:
        return true;
      case ShowResultOptions.AFTER_PARTICIPATING:
        return currentParticipant;
      case ShowResultOptions.AFTER_DEADLINE:
        return !poll.settings.deadline || +poll.settings.deadline < Date.now();
      case ShowResultOptions.NEVER:
        return false;
    }
  }

  async postParticipation(id: Types.ObjectId, dto: CreateParticipantDto, user?: UserToken): Promise<Participant> {
    const poll = await this.pollService.find(id) ?? notFound(id);
    const otherParticipants = await this.participantService.findAll(poll._id);
    const errors = checkParticipant(dto, poll.toObject(), otherParticipants);
    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }

    const participant = await this.participantService.create({
      ...dto,
      poll: id,
      createdBy: user?.sub,
    });
    await this.pollLogService.create({
      poll: id,
      createdBy: user?.sub,
      type: 'participant.created',
      data: {participant: participant._id, name: participant.name},
    });

    this.sendParticipantNotifications(poll, participant, user).catch(this.handleError);
    return participant;
  }

  private async sendParticipantNotifications(poll: Doc<Poll>, participant: Doc<Participant>, user: UserToken | undefined) {
    if (poll.createdBy && (poll.adminMail || poll.adminPush)) {
      const adminUser = await this.keycloakService.getUser(poll.createdBy);
      if (poll.adminMail && adminUser && this.pushService.hasNotificationEnabled(adminUser, 'admin:participant.new:email')) {
        this.sendAdminInfo(poll, participant, adminUser).catch(this.handleError);
      }
      if (poll.adminPush && adminUser && this.pushService.hasNotificationEnabled(adminUser, 'admin:participant.new:push')) {
        this.sendAdminPush(poll, participant, adminUser).catch(this.handleError);
      }
    }
    if (user?.email) {
      const kcUser = await this.keycloakService.getUser(user.sub);
      if (kcUser && this.pushService.hasNotificationEnabled(kcUser, 'user:participant.new:email')) {
        this.mailService.sendMail(participant.name, user.email, `Participated in Poll: ${poll.title}`, 'participated', {
          poll: poll.toObject(),
          participant: participant.toObject(),
        }).catch(this.handleError);
      }
    }
  }

  private async sendAdminInfo(poll: Poll & Document, participant: Participant & Document, adminUser: KeycloakUser) {
    const events = await this.getEvents(poll._id);
    const participation = Array(events.length).fill({});

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const state = participant.selection[event._id.toString()];
      participation[i] = {
        class: 'p-' + (state || 'no'),
        icon: state === 'yes' ? '✓' : state === 'maybe' ? '?' : 'X',
      };
    }

    if (!adminUser.email) {
      return;
    }

    const name = `${adminUser.firstName} ${adminUser.lastName}`;
    return this.mailService.sendMail(name, adminUser.email, `Updates in Poll: ${poll.title}`, 'participant', {
      name,
      poll: poll.toObject(),
      participant: participant.toObject(),
      events: events.map(({start, end}) => ({start, end})),
      participants: [{name: participant.name, participation}],
    });
  }

  private async sendAdminPush(poll: Poll & Document, participant: Participant & Document, adminUser: KeycloakUser) {
    await this.pushService.send(
      adminUser,
      `Updates in Poll: ${poll.title}`,
      `${participant.name} participated in your poll.`,
      `${environment.origin}/poll/${poll._id}/participate`,
    );
  }

  async editParticipation(id: Types.ObjectId, participantId: Types.ObjectId, token: string, participant: UpdateParticipantDto): Promise<ReadParticipantDto | null> {
    const [poll, otherParticipants] = await Promise.all([
      this.pollService.find(id),
      this.participantService.findAll(id),
    ]);
    if (!poll) {
      notFound(id);
    }

    const errors = checkParticipant(participant, poll.toObject(), otherParticipants, participantId);
    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }
    return this.participantService.updateOne({
      _id: participantId,
      token,
    }, participant);
  }

  async bookEvents(id: Types.ObjectId, events: Poll['bookedEvents'], user?: UserToken): Promise<ReadPollDto> {
    const poll = await this.pollService.update(id, {
      bookedEvents: events,
    }) ?? notFound(id);
    const eventDocs = await this.pollEventService.findAll({
      poll: id,
      _id: {$in: Object.keys(events).map(e => new Types.ObjectId(e))},
    });
    if (poll.settings.logHistory) {
      await this.pollLogService.create({
        poll: id,
        createdBy: user?.sub,
        type: 'poll.booked',
        data: {booked: Object.keys(events).length},
      });
    }
    for await (const participant of this.participantService.model.find({
      poll: id,
      createdBy: {$exists: true},
    })) {
      this.sendBookNotification(poll, participant, eventDocs).catch(error => this.logger.error(error.message, error.stack));
    }
    return poll;
  }

  private renderEvent(event: PollEvent, locale?: string, timeZone?: string) {
    return `${renderDate(event.start, locale, timeZone)} - ${renderDate(event.end, locale, timeZone)}`;
  }

  private async sendBookNotification(poll: Doc<Poll>, participant: Doc<Participant>, events: Doc<PollEvent>[]) {
    const kcUser = await this.keycloakService.getUser(participant.createdBy!);
    if (!kcUser) {
      return;
    }

    const sendPush = kcUser.attributes?.pushTokens?.length && this.pushService.hasNotificationEnabled(kcUser, 'user:poll.booked:push');
    const sendEmail = kcUser.email && this.pushService.hasNotificationEnabled(kcUser, 'user:poll.booked:email');
    if (!sendPush && !sendEmail) {
      return;
    }

    const appointments = events
      .filter(event => {
        const booked = poll.bookedEvents[event._id.toString()];
        // only show the events to the participant that are either
        if (booked === true) {
          // 1) booked entirely, or
          return true;
        } else if (Array.isArray(booked)) {
          // 2) booked for the participant
          return booked.some(id => participant._id.equals(id));
        } else {
          return false;
        }
      })
      .map(event => {
        let eventLine = this.renderEvent(event, undefined, poll.timeZone);
        const selection = participant.selection[event._id.toString()];
        if (selection === 'yes' || selection === 'maybe') {
          eventLine += ' *';
        }
        return eventLine;
      });

    if (!appointments.length) {
      // don't send them an email if there are no appointments
      return;
    }

    if (sendPush) {
      this.pushService.send(kcUser,
        `Poll concluded: ${poll.title}`,
        `The poll concluded with ${appointments.length} booked appointments.`,
        `${environment.origin}/poll/${poll._id}/participate`,
      ).catch(this.handleError);
    }
    if (sendEmail && kcUser.email) {
      this.mailService.sendMail(participant.name, kcUser.email, `Poll concluded: ${poll.title}`, 'book', {
        appointments,
        poll: poll.toObject(),
        participant: participant.toObject(),
      }).catch(this.handleError);
    }
  }

  async claimPolls(adminToken: string, createdBy: string): Promise<void> {
    await this.pollService.updateMany({adminToken}, {createdBy});
    await this.participantService.updateMany({token: adminToken}, {createdBy}, {timestamps: false});
  }
}
