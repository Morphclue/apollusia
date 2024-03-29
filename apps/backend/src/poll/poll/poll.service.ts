import {
  checkParticipant,
  CreateParticipantDto,
  MailDto,
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
import {Doc} from '@mean-stream/nestx';
import {Injectable, Logger, NotFoundException, OnModuleInit, UnprocessableEntityException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Document, FilterQuery, Model, Types} from 'mongoose';

import {environment} from '../../environment';
import {renderDate} from '../../mail/helpers';
import {MailService} from '../../mail/mail/mail.service';
import {PushService} from '../../push/push.service';

@Injectable()
export class PollService implements OnModuleInit {
  private logger = new Logger(PollService.name);

  constructor(
    @InjectModel(Poll.name) private pollModel: Model<Poll>,
    @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
    private mailService: MailService,
    private pushService: PushService,
  ) {
  }

  async onModuleInit() {
    await Promise.all([
      this.migrateSelection(),
      this.migratePollEvents(),
      this.migrateShowResults(),
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

  async getPolls(token: string, active: boolean | undefined): Promise<ReadStatsPollDto[]> {
    return this.readPolls({
      adminToken: token,
      ...this.activeFilter(active),
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
      .sort({createdAt: -1})
      .exec();
  }

  async getPoll(id: Types.ObjectId): Promise<Doc<ReadPollDto>> {
    return this.pollModel
      .findById(id)
      .select(readPollSelect)
      .populate<{participants: number}>('participants')
      .exec();
  }

  async postPoll(pollDto: PollDto): Promise<ReadPollDto> {
    const poll = await this.pollModel.create(pollDto);
    return this.mask(poll.toObject());
  }

  mask(poll: Poll): ReadPollDto {
    const {...rest} = poll;
    for (const key of readPollExcluded) {
      delete rest[key];
    }
    return rest;
  }

  async putPoll(id: Types.ObjectId, pollDto: PollDto): Promise<ReadPollDto> {
    const poll = await this.pollModel.findByIdAndUpdate(id, pollDto, {new: true}).select(readPollSelect).exec();
    if (!poll) {
      throw new NotFoundException(id);
    }
    return poll;
  }

  async clonePoll(id: Types.ObjectId): Promise<ReadPollDto> {
    const poll = await this.pollModel.findById(id).exec();
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

  async deletePoll(id: Types.ObjectId): Promise<ReadPollDto> {
    const poll = await this.pollModel.findByIdAndDelete(id, {projection: readPollSelect}).exec();
    if (!poll) {
      throw new NotFoundException(id);
    }

    await this.pollEventModel.deleteMany({poll: new Types.ObjectId(id)}).exec();
    await this.participantModel.deleteMany({poll: new Types.ObjectId(id)}).exec();
    return poll;
  }

  async getEvents(id: Types.ObjectId): Promise<ReadPollEventDto[]> {
    const [events, participants] = await Promise.all([
      this.pollEventModel.find({poll: new Types.ObjectId(id)}).sort({start: 1}).exec(),
      this.participantModel.find({poll: new Types.ObjectId(id)}).exec(),
    ]);
    return events.map(event => ({
      ...event.toObject(),
      participants: participants.filter(participant =>
        ['yes', 'maybe'].includes(participant.selection[event._id.toString()]),
      ).length,
    }));
  }

  async postEvents(poll: Types.ObjectId, pollEvents: PollEventDto[]): Promise<PollEvent[]> {
    const oldEvents = await this.pollEventModel.find({poll}).exec();
    const newEvents = pollEvents.filter(event => !oldEvents.some(oldEvent => oldEvent._id.toString() === event._id));
    await this.pollEventModel.create(newEvents.map(event => ({...event, poll})));

    const updatedEvents = pollEvents.filter(event => {
      const oldEvent = oldEvents.find(e => e._id.toString() === event._id);
      if (!oldEvent) {
        return false;
      }
      return oldEvent.start.valueOf() !== event.start.valueOf() || oldEvent.end.valueOf() !== event.end.valueOf();
    });
    if (updatedEvents.length > 0) {
      for (const event of updatedEvents) {
        await this.pollEventModel.findByIdAndUpdate(event._id, event).exec();
      }
    }

    const deletedEvents = oldEvents.filter(event => !pollEvents.some(e => e._id === event._id.toString()));
    await this.pollEventModel.deleteMany({_id: {$in: deletedEvents.map(event => event._id)}}).exec();
    await this.removeParticipations(poll, updatedEvents);
    return await this.pollEventModel.find({poll}).exec();
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

    if (poll.adminToken === token || poll.settings.showResult === ShowResultOptions.IMMEDIATELY ||
      poll.settings.showResult === ShowResultOptions.AFTER_PARTICIPATING && currentParticipant.length > 0) {
      const participants = await this.participantModel.find({
        poll: new Types.ObjectId(id),
        token: {$ne: token},
      }).select(readParticipantSelect).exec();
      return [...participants, ...currentParticipant];
    }

    return currentParticipant;
  }

  async findAllParticipants(poll: Types.ObjectId): Promise<Participant[]> {
    return this.participantModel.find({poll}).exec();
  }

  async postParticipation(id: Types.ObjectId, dto: CreateParticipantDto): Promise<Participant> {
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
    });

    poll.adminMail && this.sendAdminInfo(poll, participant);
    poll.adminPush && this.sendAdminPush(poll, participant);
    participant.mail && this.mailService.sendMail(participant.name, participant.mail, 'Participated in Poll', 'participated', {
      poll: poll.toObject(),
      participant: participant.toObject(),
    }).then();
    return participant;
  }

  private async sendAdminInfo(poll: Poll & Document, participant: Participant & Document) {
    const events = await this.getEvents(poll._id.toString());
    const participation = Array(events.length).fill({});

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const state = participant.selection[event._id.toString()];
      participation[i] = {
        class: 'p-' + (state || 'no'),
        icon: state === 'yes' ? '✓' : state === 'maybe' ? '?' : 'X',
      };
    }

    return this.mailService.sendMail('Poll Admin', poll.adminMail, 'Updates in Poll', 'participant', {
      poll: poll.toObject(),
      participant: participant.toObject(),
      events: events.map(({start, end}) => ({start, end})),
      participants: [{name: participant.name, participation}],
    });
  }

  private async sendAdminPush(poll: Poll & Document, participant: Participant & Document) {
    await this.pushService.send(poll.adminPush, 'Updates in Poll | Apollusia', `${participant.name} participated in your poll ${poll.title}`, `${environment.origin}/poll/${poll._id}/participate`);
  }

  async editParticipation(id: Types.ObjectId, participantId: Types.ObjectId, token: string, participant: UpdateParticipantDto): Promise<ReadParticipantDto | null> {
    const [poll, otherParticipants] = await Promise.all([
      this.getPoll(id),
      this.findAllParticipants(new Types.ObjectId(id)),
    ]);
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

  async bookEvents(id: Types.ObjectId, events: Types.ObjectId[]): Promise<ReadPollDto> {
    const poll = await this.pollModel.findByIdAndUpdate(id, {
      bookedEvents: events,
    }, {new: true})
      .populate<{bookedEvents: PollEvent[]}>('bookedEvents')
      .select(readPollSelect)
      .exec();
    for await (const participant of this.participantModel.find({poll: new Types.ObjectId(id)})) {
      const appointments = poll.bookedEvents.map(event => {
        let eventLine = this.renderEvent(event, undefined, poll.timeZone);
        const selection = participant.selection[event._id.toString()];
        if (selection === 'yes' || selection === 'maybe') {
          eventLine += ' *';
        }
        return eventLine;
      });
      this.mailService.sendMail(participant.name, participant.mail, 'Poll booked', 'book', {
        appointments,
        poll: poll.toObject(),
        participant: participant.toObject(),
      }).then();
    }
    return {...poll.toObject(), bookedEvents: events};
  }

  private renderEvent(event: PollEvent, locale?: string, timeZone?: string) {
    return `${renderDate(event.start, locale, timeZone)} - ${renderDate(event.end, locale, timeZone)}`;
  }

  private async removeParticipations(poll: Types.ObjectId, events: PollEventDto[]) {
    if (!events.length) {
      return;
    }
    const filter = {
      poll,
      $or: events.map(e => ({['selection.' + e._id]: {$exists: true}})),
    };
    await this.participantModel.updateMany(filter, {
      $unset: events.map(e => 'selection.' + e._id),
    }, {timestamps: false}).exec();
  }

  async setMail(mailDto: MailDto) {
    const participants = await this.participantModel.find({token: mailDto.token}).exec();
    participants.forEach(participant => {
      participant.mail = mailDto.mail;
      participant.token = mailDto.token;
    });
    await this.participantModel.updateMany({token: mailDto.token}, {
      mail: mailDto.mail,
      token: mailDto.token,
    }).exec();
  }

  async isAdmin(id: Types.ObjectId, token: string) {
    return this.pollModel.findById(id).exec().then(poll => poll.adminToken === token);
  }
}
