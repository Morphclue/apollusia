import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {ParticipantDto, PollDto, PollEventDto} from '../../dto';
import {Participant, Poll, PollEvent} from '../../schema';

@Injectable()
export class PollService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
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

    async putPoll(id: string, pollDto: PollDto): Promise<Poll> {
        return this.pollModel.findByIdAndUpdate(id, pollDto, {new: true}).exec();
    }

    async deletePoll(id: string): Promise<Poll | undefined> {
        await this.pollEventModel.deleteMany({poll: id}).exec();
        await this.participantModel.deleteMany({poll: id}).exec();
        return this.pollModel.findByIdAndDelete(id).exec();
    }

    async postEvents(id: string, poll: Poll, pollEvents: PollEventDto[]): Promise<Poll> {
        await poll.events.forEach(event => {
            this.pollEventModel.deleteMany({poll: event.poll}).exec();
        });
        poll.events = await this.pollEventModel.create(pollEvents);
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
        });
    }

    async editParticipation(id: string, participantId: string, participant: ParticipantDto): Promise<Participant> {
        return this.participantModel.findByIdAndUpdate(participantId, participant, {new: true}).exec();
    }

    async deleteParticipation(id: string, participantId: string): Promise<Participant> {
        return this.participantModel.findByIdAndDelete(participantId).exec();
    }

    async bookEvents(id: string, poll: Poll, events: PollEventDto[]): Promise<Poll> {
        poll.bookedEvents = await this.pollEventModel.find({_id: {$in: events.map(event => event._id)}}).exec();
        this.mailParticipants(id, poll).then();
        return this.pollModel.findByIdAndUpdate(id, poll, {new: true}).exec();
    }

    private async mailParticipants(id: string, poll: Poll) {
        const participants = await this.participantModel.find({poll: id}).populate(['participation', 'indeterminateParticipation']).exec();
        participants.forEach(participant => {
            const participations = [...participant.participation, ...participant.indeterminateParticipation];
            let message = 'The following appointments have been booked:\n';
            poll.bookedEvents.forEach((event: any) => {
                message = message.concat(event.start + ' ' + event.end);
                // TODO: use includes and remove any-type (not working currently)
                if (participations.some((p: any) => p._id.toString() === event._id.toString())) {
                    message = message.concat(' *');
                }
                message = message.concat('\n');
            });
            message = message.concat('You have agreed to appointments marked with *.');
            // TODO: implement mail service
            console.log(message);
        });
    }
}
