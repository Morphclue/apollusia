import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {StatisticsDto} from '../../dto';
import {Participant, Poll, PollEvent} from '@apollusia/types';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(PollEvent.name) private pollEventModel: Model<PollEvent>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    async getStats(): Promise<StatisticsDto> {
        const [
            polls,
            pollEvents,
            participants,
            pollTokens,
            participantTokens,
        ] = await Promise.all([
            this.pollModel.countDocuments().exec(),
            this.pollEventModel.countDocuments().exec(),
            this.participantModel.countDocuments().exec(),
            this.pollModel.distinct('token').exec(),
            this.participantModel.distinct('token').exec(),
        ]);
        return {
            polls,
            pollEvents,
            participants,
            // TODO this may be inefficient with large number of users
            users: new Set([...pollTokens, ...participantTokens]).size,
        };
    }
}
