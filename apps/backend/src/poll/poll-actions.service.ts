import {
  checkParticipant,
  CreateParticipantDto,
  Participant,
  Poll,
  PollDto,
  PollEvent,
  PollEventDto,
  ReadParticipantDto,
  readParticipantSelect,
  ReadPollDto,
  ReadPollEventDto,
  readPollExcluded,
  readPollSelect,
  ReadStatsPollDto,
  ShowResultOptions,
  UpdateParticipantDto,
} from '@apollusia/types';
import {UserToken} from '@mean-stream/nestx/auth';
import {notFound} from '@mean-stream/nestx/not-found';
import {Doc} from '@mean-stream/nestx/ref';
import {
  ForbiddenException,
  Injectable,
  Logger, NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Document, FilterQuery, Model, Types} from 'mongoose';

import {KeycloakUser} from '../auth/keycloak-user.interface';
import {KeycloakService} from '../auth/keycloak.service';
import {environment} from '../environment';
import {renderDate} from '../mail/helpers';
import {MailService} from '../mail/mail/mail.service';
import {PollLogService} from '../poll-log/poll-log.service';
import {PushService} from '../push/push.service';

@Injectable()
export class PollActionsService implements OnModuleInit {
  private logger = new Logger(PollActionsService.name);
  private handleError = (err: Error) => this.logger.error(err.message, err.stack);

  constructor(
    @InjectModel(Poll.name) private pollModel: Model<Poll>,
    @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
    private mailService: MailService,
    private pushService: PushService,
    private pollLogService: PollLogService,
    private keycloakService: KeycloakService,
  ) {
  }

  async onModuleInit() {
    await Promise.all([
      this.migrateSelection(),
      this.migratePollEvents(),
      this.migrateShowResults(),
      this.migrateBookedEvents(),
    ]);
  }

  private async migrateSelection() {
    const participants = await this.participantModel.find({
      $or: [
        {participation: {$exists: true}},
        {indeterminateParticipation: {$exists: true}},
      ],
    }).exec();
    for (const participant of participants) {
      participant.selection ||= {};
      for (const participation of (participant as any).participation || []) {
        participant.selection[participation.toString()] = 'yes';
      }
      for (const participation of (participant as any).indeterminateParticipation || []) {
        participant.selection[participation.toString()] = 'maybe';
      }
      participant.markModified('selection');
      participant.set('participation', undefined);
      participant.set('indeterminateParticipation', undefined);
    }
    await this.participantModel.bulkSave(participants, {timestamps: false});
    participants.length && this.logger.log(`Migrated ${participants.length} participants to the new selection format.`);
  }

  private async migratePollEvents() {
    const pollEvents = await this.pollEventModel.find({
      $or: [
        {start: {$type: 'string'}},
        {end: {$type: 'string'}},
      ],
    });
    for (const pollEvent of pollEvents) {
      // NB: needs to happen here instead of aggregation pipeline, because MongoDB does not understand
      //     the strange date format returned by Date.toString() that was sometimes used in the past.
      pollEvent.start = new Date(pollEvent.start);
      pollEvent.end = new Date(pollEvent.end);
      pollEvent.markModified('start');
      pollEvent.markModified('end');
    }
    await this.pollEventModel.bulkSave(pollEvents, {timestamps: false});
    pollEvents.length && this.logger.log(`Migrated ${pollEvents.length} poll events to the new date format.`);
  }

  private async migrateShowResults() {
    const result = await this.pollModel.updateMany(
      {'settings.blindParticipation': {$exists: true}},
      [
        {
          $set: {
            'settings.showResult': {
              $cond: {
                if: {$eq: ['$settings.blindParticipation', true]},
                then: ShowResultOptions.AFTER_PARTICIPATING,
                else: ShowResultOptions.IMMEDIATELY,
              },
            },
          },
        },
        {
          $unset: 'settings.blindParticipation',
        },
      ],
      {timestamps: false},
    ).exec();
    result.modifiedCount && this.logger.log(`Migrated ${result.modifiedCount} polls to the new show result format.`);
  }

  private async migrateBookedEvents() {
    // migrate all Poll's bookedEvents: ObjectId[] to Record<ObjectId, true>
    const polls = await this.pollModel.find({bookedEvents: {$type: 'array'}}).exec();
    if (!polls.length) {
      return;
    }

    for (const poll of polls) {
      const bookedEvents = poll.bookedEvents as unknown as Types.ObjectId[];
      const newBookedEvents: Record<string, true> = {};
      for (const event of bookedEvents) {
        newBookedEvents[event.toString()] = true;
      }
      poll.bookedEvents = newBookedEvents;
      poll.markModified('bookedEvents');
    }
    await this.pollModel.bulkSave(polls, {timestamps: false});
    this.logger.log(`Migrated ${polls.length} polls to the new booked events format.`);
  }

  private activeFilter(active: boolean | undefined): FilterQuery<Poll> {
    if (active === undefined) {
      return {};
    }
    const date = new Date(Date.now() - environment.polls.activeDays * 24 * 60 * 60 * 1000);
    return active ? {
      $or: [
        {'settings.deadline': {$gt: date}},
        {'settings.deadline': {$exists: false}},
        {'settings.deadline': null},
      ],
    } : {
      'settings.deadline': {$ne: null, $lte: date},
    };
  }

  async getPolls(token: string, user: string | undefined, active: boolean | undefined): Promise<ReadStatsPollDto[]> {
    return this.readPolls({
      $and: [
        user ? {$or: [{createdBy: user}, {adminToken: token}]} : {adminToken: token},
        this.activeFilter(active),
      ],
    });
  }

  async getParticipatedPolls(token: string): Promise<ReadStatsPollDto[]> {
    const pollIds = await this.participantModel.distinct('poll', {token}).exec();
    return this.readPolls({
      _id: {$in: pollIds},
    });
  }

  private async readPolls(filter: FilterQuery<Poll>): Promise<ReadStatsPollDto[]> {
    return this.pollModel
      .find(filter)
      .select(readPollSelect)
      .populate<{participants: number}>('participants')
      .populate<{events: number}>('events')
      .populate<{comments: number}>('comments')
      .sort({createdAt: -1})
      .exec();
  }

  // Only for internal use
  async find(id: Types.ObjectId): Promise<Doc<Poll> | null> {
    return this.pollModel.findById(id).exec();
  }

  // Only for internal use
  async findParticipant(id: Types.ObjectId): Promise<Doc<Participant> | null> {
    return this.participantModel.findById(id).exec();
  }

  async getPoll(id: Types.ObjectId): Promise<Doc<ReadPollDto> | null> {
    return this.pollModel
      .findById(id)
      .select(readPollSelect)
      .populate<{participants: number}>('participants')
      .populate<{events: number}>('events')
      .exec();
  }

  async postPoll(pollDto: PollDto, user?: UserToken): Promise<ReadPollDto> {
    const poll = await this.pollModel.create(user ? {...pollDto, createdBy: user.sub} : pollDto);
    return this.mask(poll.toObject());
  }

  mask(poll: Poll): ReadPollDto {
    const {...rest} = poll;
    for (const key of readPollExcluded) {
      // @ts-expect-error TS2790
      delete rest[key];
    }
    return rest;
  }

  async putPoll(id: Types.ObjectId, pollDto: PollDto): Promise<ReadPollDto | null> {
    return this.pollModel.findByIdAndUpdate(id, pollDto, {new: true}).select(readPollSelect).exec();
  }

  async clonePoll(id: Types.ObjectId): Promise<ReadPollDto | null> {
    const poll = await this.pollModel.findById(id).exec();
    if (!poll) {
      return null;
    }
    const {_id, id: _, title, ...rest} = poll.toObject();
    const pollEvents = await this.pollEventModel.find({poll: new Types.ObjectId(id)}).exec();
    const clonedPoll = await this.postPoll({
      ...rest,
      title: `${title} (clone)`,
    });
    await this.pollEventModel.create(pollEvents.map(({start, end, note}) => ({
      poll: clonedPoll._id,
      start,
      end,
      note,
    })));
    return clonedPoll;
  }

  async deletePoll(id: Types.ObjectId): Promise<ReadPollDto | null> {
    const poll = await this.pollModel.findByIdAndDelete(id, {projection: readPollSelect}).exec();
    await this.pollEventModel.deleteMany({poll: id}).exec();
    await this.participantModel.deleteMany({poll: id}).exec();
    return poll;
  }

  async getEvents(id: Types.ObjectId): Promise<ReadPollEventDto[]> {
    const [events, participants] = await Promise.all([
      this.pollEventModel.find({poll: new Types.ObjectId(id)}).sort({start: 1}).exec(),
      this.participantModel.find({poll: new Types.ObjectId(id)}).exec(),
    ]);
    return events.map(event => ({
      ...event.toObject(),
      participants: participants.filter(participant => {
        const selection = participant.selection[event._id.toString()];
        return selection && ['yes', 'maybe'].includes(selection);
      }).length,
    }));
  }

  async postEvents(poll: Types.ObjectId, pollEvents: PollEventDto[], user?: UserToken): Promise<PollEvent[]> {
    const pollDoc = await this.pollModel.findById(poll).exec() ?? notFound(poll);

    const oldEvents = await this.pollEventModel.find({poll}).exec();
    const newEvents = pollEvents.filter(event => !oldEvents.some(oldEvent => oldEvent._id.equals(event._id)));
    await this.pollEventModel.create(newEvents.map(event => ({...event, poll})));

    const updatedEvents = pollEvents.filter(event => {
      const oldEvent = oldEvents.find(e => e._id.equals(event._id));
      if (!oldEvent) {
        return false;
      }
      return oldEvent.start.valueOf() !== event.start.valueOf() || oldEvent.end.valueOf() !== event.end.valueOf();
    });
    if (updatedEvents.length > 0) {
      await Promise.all(updatedEvents.map(event => this.pollEventModel.findByIdAndUpdate(event._id, event)));
    }

    const deletedEvents = oldEvents.filter(event => !pollEvents.some(e => event._id.equals(e._id)));
    await this.pollEventModel.deleteMany({_id: {$in: deletedEvents.map(event => event._id)}}).exec();
    await this.removeParticipations(poll, [...updatedEvents, ...deletedEvents]);

    if (pollDoc.settings.logHistory) {
      await this.pollLogService.create({
        poll,
        createdBy: user?.sub,
        type: 'events.changed',
        data: {created: newEvents.length, updated: updatedEvents.length, deleted: deletedEvents.length},
      });
    }

    for await (const participant of this.participantModel.find({
      poll,
      createdBy: {$exists: true},
    })) {
      this.sendPollChangeNotification(pollDoc, participant).catch(this.handleError);
    }

    return this.pollEventModel.find({poll}).exec();
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

  private async removeParticipations(poll: Types.ObjectId, events: (PollEventDto | Doc<PollEvent>)[]) {
    if (!events.length) {
      return;
    }
    const filter = {
      poll,
      $or: events.map(e => ({['selection.' + e._id]: {$exists: true}})),
    };
    await this.participantModel.updateMany(filter, {
      $unset: events.reduce((acc, e) => ({...acc, ['selection.' + e._id]: true}), {})
    }, {timestamps: false}).exec();
  }

  async getParticipants(id: Types.ObjectId, token: string): Promise<ReadParticipantDto[]> {
    const poll = await this.pollModel.findById(id).exec();
    if (!poll) {
      throw new NotFoundException(id);
    }
    const currentParticipant = await this.participantModel.find({
      poll: new Types.ObjectId(id),
      token,
    }).exec();

    if (this.canViewResults(poll, token, currentParticipant.length > 0)) {
      const participants = await this.participantModel.find({
        poll: new Types.ObjectId(id),
        token: {$ne: token},
      }).select(readParticipantSelect).exec();
      return [...participants, ...currentParticipant];
    }

    return currentParticipant;
  }

  private canViewResults(poll: Poll, token: string, currentParticipant: boolean) {
    if (poll.adminToken === token) {
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

  async findAllParticipants(poll: Types.ObjectId): Promise<Participant[]> {
    return this.participantModel.find({poll}).exec();
  }

  async postParticipation(id: Types.ObjectId, dto: CreateParticipantDto, user?: UserToken): Promise<Participant> {
    const poll = await this.pollModel.findById(id).exec();
    if (!poll) {
      throw new NotFoundException(id);
    }

    const otherParticipants = await this.findAllParticipants(poll._id);
    const errors = checkParticipant(dto, poll.toObject(), otherParticipants);
    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }

    const participant = await this.participantModel.create({
      ...dto,
      poll: new Types.ObjectId(id),
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
      this.getPoll(id),
      this.findAllParticipants(new Types.ObjectId(id)),
    ]);
    if (!poll) {
      notFound(id);
    }

    const errors = checkParticipant(participant, poll.toObject(), otherParticipants, participantId);
    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }
    return this.participantModel.findOneAndUpdate({
      _id: participantId,
      token,
    }, participant, {new: true}).exec();
  }

  async deleteParticipation(id: Types.ObjectId, participantId: Types.ObjectId): Promise<ReadParticipantDto | null> {
    return this.participantModel.findByIdAndDelete(participantId, {projection: readParticipantSelect}).exec();
  }

  async bookEvents(id: Types.ObjectId, events: Poll['bookedEvents'], user?: UserToken): Promise<ReadPollDto> {
    const poll = await this.pollModel.findByIdAndUpdate(id, {
      bookedEvents: events,
    }, {new: true})
      .select(readPollSelect)
      .exec() ?? notFound(id);
    const eventDocs = await this.pollEventModel.find({
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
    for await (const participant of this.participantModel.find({
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

  isAdmin(poll: Poll, token: string | undefined, user: string | undefined) {
    return poll.adminToken === token || poll.createdBy === user;
  }

  async claimPolls(adminToken: string, createdBy: string): Promise<void> {
    await this.pollModel.updateMany({adminToken}, {createdBy}).exec();
    await this.participantModel.updateMany({token: adminToken}, {createdBy}, {timestamps: false}).exec();
  }
}
