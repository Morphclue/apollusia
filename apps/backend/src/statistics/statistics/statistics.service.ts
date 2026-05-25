import {Participant, Poll, PollEvent, StatisticsDto} from '@apollusia/types';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

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
            userCount,
        ] = await Promise.all([
            this.pollModel.countDocuments().exec(),
            this.pollEventModel.countDocuments().exec(),
            this.participantModel.countDocuments().exec(),
            this.pollModel.aggregate<{users: number}>([
                {$match: {adminToken: {$exists: true, $ne: null}}},
                {$project: {_id: 0, token: '$adminToken'}},
                {
                    $unionWith: {
                        coll: this.participantModel.collection.name,
                        pipeline: [
                            {$match: {token: {$exists: true, $ne: null}}},
                            {$project: {_id: 0, token: 1}},
                        ],
                    },
                },
                {$group: {_id: '$token'}},
                {$count: 'users'},
            ]).exec(),
        ]);
        return {
            polls,
            pollEvents,
            participants,
            users: userCount[0]?.users ?? 0,
        };
    }
}
