import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Poll} from '../../schema/poll.schema';
import {PollDto} from '../../dto/poll.dto';
import {Participant} from '../../schema/participant.schema';
import {ParticipantDto} from '../../dto/participant.dto';

@Injectable()
export class PollService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    async getPolls(): Promise<Poll[]> {
        return this.pollModel.find().exec();
    }

    async getPoll(id: string): Promise<Poll> {
        return this.pollModel.findById(id).exec();
    }

    async postPoll(pollDto: PollDto): Promise<Poll> {
        return this.pollModel.create(pollDto);
    }

    async putPoll(pollDto: PollDto): Promise<Poll> {
        // FIXME
        return this.pollModel.findByIdAndUpdate(pollDto, pollDto, {new: true}).exec();
    }

    async deletePoll(id: string): Promise<Poll | undefined> {
        return this.pollModel.findByIdAndDelete(id).exec();
    }

    async postEvents(id: string, poll: Poll): Promise<Poll> {
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
