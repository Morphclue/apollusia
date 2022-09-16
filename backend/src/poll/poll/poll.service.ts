import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';

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
        return this.pollModel.find({adminToken: token}).exec();
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
        for (const pollEvent of pollEvents) {
            await this.pollEventModel.findByIdAndUpdate(
                pollEvent._id ?? new mongoose.Types.ObjectId(), {
                    poll: id,
                    start: pollEvent.start,
                    end: pollEvent.end,
                }, {upsert: true});
        }

        // FIXME: might be easier than that
        const pollEventDoc = await this.pollEventModel.find({poll: id}).exec();
        poll.events = [];
        pollEventDoc.forEach((pollEvent) => {
            poll.events.push(pollEvent.id);
        });

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

    editParticipation(id: string, participantId: string, participant: ParticipantDto) {
        return this.participantModel.findByIdAndUpdate(participantId, participant, {new: true}).exec();
    }

    deleteParticipation(id: string, participantId: string) {
        return this.participantModel.findByIdAndDelete(participantId).exec();
    }
}
