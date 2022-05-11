import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {PollDto} from './dto/poll.dto';
import {Poll} from './schema/poll.schema';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
    ) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    async getPolls(): Promise<Poll[]> {
        return this.pollModel.find().exec();
    }

    async getPoll(id: string): Promise<Poll> {
        return this.pollModel.findById(id).exec();
    }

    async postPoll(pollDto: PollDto): Promise<Poll> {
        const createdPoll = new this.pollModel(pollDto);
        return createdPoll.save();
    }

    async putPoll(pollDto: PollDto): Promise<Poll> {
        return this.pollModel.findByIdAndUpdate(pollDto.id, pollDto).exec();
    }

    async deletePoll(id: string): Promise<Poll | undefined> {
        return this.pollModel.findByIdAndDelete(id).exec();
    }
}
