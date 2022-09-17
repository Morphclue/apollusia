import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Participant, Poll, PollEvent} from '../../schema';
import {StatisticsDto} from '../../dto';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    async getStats() {
        return {
            polls: await this.pollModel.countDocuments().exec(),
            pollEvents: await this.pollEventModel.countDocuments().exec(),
            participants: await this.participantModel.countDocuments().exec(),
        } as StatisticsDto;
    }
}
