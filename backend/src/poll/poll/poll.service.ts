import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';

import {Poll} from '../../schema/poll.schema';
import {PollDto} from '../../dto/poll.dto';
import {Participant} from '../../schema/participant.schema';
import {ParticipantDto} from '../../dto/participant.dto';
import {PollEvent} from '../../dto/poll-event.dto';

@Injectable()
export class PollService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    async getPolls(): Promise<Poll[]> {
        return this.pollModel.find().exec();
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
        return this.pollModel.findByIdAndDelete(id).exec();
    }

    async postEvents(id: string, poll: Poll, pollEvents: PollEvent[]): Promise<Poll> {
        for (const pollEvent of pollEvents) {
            await this.pollEventModel.findByIdAndUpdate(
                pollEvent._id ?? new mongoose.Types.ObjectId(), {
                    poll: id,
                    title: pollEvent.title,
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

    async getParticipate(id: string) {
        return this.participantModel.find({poll: id}).exec();
    }

    async postParticipation(id: string, participant: ParticipantDto): Promise<Participant> {
        return this.participantModel.create({
            poll: id,
            name: participant.name,
            participation: participant.participation,
        });
    }
}
