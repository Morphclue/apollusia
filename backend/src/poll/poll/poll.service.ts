import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {ParticipantDto, PollDto, PollEventDto} from '../../dto';
import {Participant, Poll, PollEvent} from '../../schema';
import {MailDto} from '../../dto';
import {MailService} from '../../mail/mail/mail.service';

@Injectable()
export class PollService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
        private mailService: MailService,
    ) {
    }

    async getPolls(token: string): Promise<Poll[]> {
        const adminPolls = await this.pollModel.find({adminToken: token}).exec();
        const participants = await this.participantModel.find({token}, null, {populate: 'poll'}).exec();
        const participantPolls = participants.map(participant => participant.poll);
        let polls = [...adminPolls, ...participantPolls];
        return polls.filter((poll: any, index) => polls.findIndex((p: any) => p._id.toString() === poll._id.toString()) === index);
    }

    async getPoll(id: string): Promise<Poll> {
        return this.pollModel.findById(id, null, {populate: 'events'}).exec();
    }

    async postPoll(pollDto: PollDto): Promise<Poll> {
        return this.pollModel.create(pollDto);
    }

    async clonePoll(poll: Poll) {
        return await this.pollModel.create({
            title: poll.title,
            description: poll.description,
            location: poll.location,
            adminToken: poll.adminToken,
            settings: poll.settings,
            events: await this.pollEventModel.create(poll.events),
        });
    }

    async putPoll(id: string, pollDto: PollDto): Promise<Poll> {
        return this.pollModel.findByIdAndUpdate(id, pollDto, {new: true}).exec();
    }

    async deletePoll(id: string, poll: Poll): Promise<Poll | undefined> {
        await poll.events.forEach(event => {
            this.pollEventModel.deleteMany({poll: event.poll}).exec();
        });
        await this.participantModel.deleteMany({poll: id}).exec();
        return this.pollModel.findByIdAndDelete(id).exec();
    }

    async postEvents(id: string, poll: Poll, pollEvents: PollEventDto[]): Promise<Poll> {
        const newEvents = await this.pollEventModel.create(pollEvents.filter(event => !event._id));
        const updatedEvents = pollEvents.filter(event => event._id);
        const changedEvents = updatedEvents.filter(event => {
            const oldEvent = poll.events.find((e: any) => e._id.toString() === event._id);
            return oldEvent.start !== event.start || oldEvent.end !== event.end;
        });

        await this.removeParticipations(id, changedEvents);

        const deletedEvents = poll.events.filter((event: any) => !updatedEvents.some(e => e._id.toString() === event._id.toString()));
        await this.pollEventModel.deleteMany({_id: {$in: deletedEvents}}).exec();
        // TODO: use updateMany
        for (const event of changedEvents) {
            await this.pollEventModel.findByIdAndUpdate(event._id, event, {new: true}).exec();
        }
        poll.events = [...poll.events, ...newEvents];
        return this.pollModel.findByIdAndUpdate(id, poll, {new: true}).exec();
    }

    async getParticipants(id: string) {
        return this.participantModel.find({poll: id}).populate(['participation', 'indeterminateParticipation']).exec();
    }

    async postParticipation(id: string, participant: ParticipantDto): Promise<Participant> {
        return this.participantModel.create({
            poll: id,
            name: participant.name,
            participation: participant.participation,
            indeterminateParticipation: participant.indeterminateParticipation,
            token: participant.token,
            mail: participant.mail,
        });
    }

    async editParticipation(id: string, participantId: string, participant: ParticipantDto): Promise<Participant> {
        return this.participantModel.findByIdAndUpdate(participantId, participant, {new: true}).exec();
    }

    async deleteParticipation(id: string, participantId: string): Promise<Participant> {
        return this.participantModel.findByIdAndDelete(participantId).exec();
    }

    async bookEvents(id: string, poll: Poll, events: string[]): Promise<Poll> {
        poll.bookedEvents = await this.pollEventModel.find({_id: {$in: events}}).exec();
        this.mailParticipants(id, poll).then();
        return this.pollModel.findByIdAndUpdate(id, poll, {new: true}).exec();
    }

    private async mailParticipants(id: string, poll: Poll) {
        const participants = await this.participantModel.find({poll: id}).populate(['participation', 'indeterminateParticipation']).exec();
        participants.forEach(participant => {
            const participations = [...participant.participation, ...participant.indeterminateParticipation];
            let message = 'The following appointments have been booked:\n';
            poll.bookedEvents.forEach((event: any) => {
                message = message.concat(`${new Date(event.start).toLocaleString()} - ${new Date(event.end).toLocaleString()}`);
                // TODO: use includes and remove any-type (not working currently)
                if (participations.some((p: any) => p._id.toString() === event._id.toString())) {
                    message = message.concat(' *');
                }
                message = message.concat('\n');
            });
            message = message.concat('You have agreed to appointments marked with *.');
            this.mailService.sendMail(participant.mail, message);
        });
    }

    private async removeParticipations(id: string, events: PollEventDto[]) {
        const changedParticipants = await this.participantModel.find({
            poll: id,
            participation: {$in: events.map(event => event._id)},
        }).exec();
        const indeterminateParticipants = await this.participantModel.find({
            poll: id,
            indeterminateParticipation: {$in: events.map(event => event._id)},
        });

        changedParticipants.forEach(participant => {
            participant.participation = participant.participation.filter((event: any) =>
                !events.some(e => e._id.toString() === event._id.toString()));
            this.participantModel.findByIdAndUpdate(participant._id, participant).exec();
        });

        indeterminateParticipants.forEach(participant => {
            participant.indeterminateParticipation = participant.indeterminateParticipation.filter((event: any) =>
                !events.some(e => e._id.toString() === event._id.toString()));
            this.participantModel.findByIdAndUpdate(participant._id, participant).exec();
        });
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
}
