import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Document, Model, Types} from 'mongoose';

import {MailDto, ParticipantDto, PollDto, PollEventDto, ReadParticipantDto, readParticipantSelect} from '../../dto';
import {ReadPollDto, readPollExcluded, readPollSelect, ReadStatsPollDto} from '../../dto/read-poll.dto';
import {renderDate} from '../../mail/helpers';
import {MailService} from '../../mail/mail/mail.service';
import {Participant, Poll, PollEvent} from '../../schema';

@Injectable()
export class PollService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
        private mailService: MailService,
    ) {
    }

    async getPolls(token: string): Promise<ReadStatsPollDto[]> {
        const adminPolls = await this.pollModel.find({adminToken: token}).select(readPollSelect).exec();
        const participants = await this.participantModel.find({
            token,
            _id: {$nin: adminPolls.map(p => p._id)},
        }).populate<{ poll: Poll & Document }>('poll').exec();
        const polls = [
            ...adminPolls.map(p => p.toObject<Poll>()),
            ...participants.map(participant => participant.poll.toObject<Poll>()),
        ];
        return Promise.all(polls.map(async (poll): Promise<ReadStatsPollDto> => ({
            ...this.mask(poll),
            isAdmin: adminPolls.some(p => p._id.toString() === poll._id.toString()),
            events: await this.pollEventModel.count({poll: poll._id}).exec(),
            participants: await this.participantModel.count({poll: poll._id}).exec(),
        })));
    }

    async getPoll(id: string): Promise<ReadPollDto> {
        return this.pollModel.findById(id).select(readPollSelect).exec();
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

    async putPoll(id: string, pollDto: PollDto): Promise<ReadPollDto> {
        return this.pollModel.findByIdAndUpdate(id, pollDto, {new: true}).select(readPollSelect).exec();
    }

    async clonePoll(id: string): Promise<ReadPollDto> {
        const poll = await this.pollModel.findById(id).exec();
        const {_id, title, ...rest} = poll.toObject();
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

    async deletePoll(id: string): Promise<ReadPollDto | undefined> {
        const poll = await this.pollModel.findByIdAndDelete(id).select(readPollSelect).exec();
        if (!poll) {
            return;
        }

        await this.pollEventModel.deleteMany({poll: new Types.ObjectId(id)}).exec();
        await this.participantModel.deleteMany({poll: new Types.ObjectId(id)}).exec();
        return poll;
    }

    async getEvents(id: string): Promise<PollEvent[]> {
        return await this.pollEventModel.find({poll: new Types.ObjectId(id)}).exec();
    }

    async postEvents(id: string, pollEvents: PollEventDto[]): Promise<PollEvent[]> {
        const oldEvents = await this.pollEventModel.find({poll: new Types.ObjectId(id)}).exec();
        const newEvents = pollEvents.filter(event => !oldEvents.some(oldEvent => oldEvent._id.toString() === event._id));
        await this.pollEventModel.create(newEvents.map(event => ({...event, poll: new Types.ObjectId(id)})));

        const updatedEvents = pollEvents.filter(event => {
            const oldEvent = oldEvents.find(e => e._id.toString() === event._id);
            if (!oldEvent) {
                return false;
            }
            return oldEvent.start !== event.start || oldEvent.end !== event.end;
        });
        if (updatedEvents.length > 0) {
            for (const event of updatedEvents) {
                await this.pollEventModel.findByIdAndUpdate(event._id, event).exec();
            }
        }

        const deletedEvents = oldEvents.filter(event => !pollEvents.some(e => e._id === event._id.toString()));
        await this.pollEventModel.deleteMany({_id: {$in: deletedEvents.map(event => event._id)}}).exec();
        await this.removeParticipations(id, updatedEvents);
        return await this.pollEventModel.find({poll: new Types.ObjectId(id)}).exec();
    }

    async getParticipants(id: string): Promise<ReadParticipantDto[]> {
        return this.participantModel.find({poll: new Types.ObjectId(id)}).select(readParticipantSelect).exec();
    }

    async postParticipation(id: string, dto: ParticipantDto): Promise<Participant> {
        const poll = await this.pollModel.findById(id).exec();
        if (!poll) {
            throw new NotFoundException(id);
        }
        const participant = await this.participantModel.create({
            ...dto,
            poll: new Types.ObjectId(id),
        });

        poll.adminMail && this.sendAdminInfo(poll, participant);
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
            const yes = participant.participation.some(e => e._id.toString() === event._id.toString());
            const maybe = participant.indeterminateParticipation.some(e => e._id.toString() === event._id.toString());
            participation[i] = {
                class: yes ? 'p-yes' : maybe ? 'p-maybe' : 'p-no',
                icon: yes ? '✓' : maybe ? '?' : 'X',
            };
        }

        return this.mailService.sendMail('Poll Admin', poll.adminMail, 'Updates in Poll', 'participant', {
            poll: poll.toObject(),
            participant: participant.toObject(),
            events: events.map(({start, end}) => ({start, end})),
            participants: [{name: participant.name, participation}],
        });
    }

    async editParticipation(id: string, participantId: string, participant: ParticipantDto): Promise<ReadParticipantDto | null> {
        return this.participantModel.findByIdAndUpdate(participantId, participant, {new: true}).select(readParticipantSelect).exec();
    }

    async deleteParticipation(id: string, participantId: string): Promise<ReadParticipantDto | null> {
        return this.participantModel.findByIdAndDelete(participantId).select(readParticipantSelect).exec();
    }

    async bookEvents(id: string, events: Types.ObjectId[]): Promise<ReadPollDto> {
        const poll = await this.pollModel.findByIdAndUpdate(id, {
            bookedEvents: events,
        }, {new: true})
            .populate<{ bookedEvents: PollEvent[] }>('bookedEvents')
            .select(readPollSelect)
            .exec();
        for await (const participant of this.participantModel.find({poll: new Types.ObjectId(id)}).populate(['participation', 'indeterminateParticipation'])) {
            const participations = [...participant.participation, ...participant.indeterminateParticipation];
            const appointments = poll.bookedEvents.map(event => {
                let eventLine = this.renderEvent(event, undefined, poll.timeZone);
                if (participations.some(p => p._id.toString() === event._id.toString())) {
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

    private async removeParticipations(id: string, events: PollEventDto[]) {
        const changedParticipants = await this.participantModel.find({
            poll: new Types.ObjectId(id),
            participation: {$in: events.map(event => event._id)},
        }).exec();

        for (const participant of changedParticipants) {
            participant.participation = participant.participation.filter((event: any) =>
                !events.some(e => e._id.toString() === event._id.toString()));
            await this.participantModel.findByIdAndUpdate(participant._id, participant).exec();
        }

        const indeterminateParticipants = await this.participantModel.find({
            poll: new Types.ObjectId(id),
            indeterminateParticipation: {$in: events.map(event => event._id)},
        });

        for (const participant of indeterminateParticipants) {
            participant.indeterminateParticipation = participant.indeterminateParticipation.filter((event: any) =>
                !events.some(e => e._id.toString() === event._id.toString()));
            await this.participantModel.findByIdAndUpdate(participant._id, participant).exec();
        }
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

    async isAdmin(id: string, token: string) {
        return this.pollModel.findById(id).exec().then(poll => poll.adminToken === token);
    }
}
