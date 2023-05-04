import {Participant, Poll, PollEvent} from '@apollusia/types';
import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';

import {StatisticsService} from './statistics.service';
import {ParticipantStub} from '../../../test/stubs/ParticipantStub';
import {PollEventStub} from '../../../test/stubs/PollEventStub';
import {PollStub} from '../../../test/stubs/PollStub';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {StatisticsModule} from '../statistics.module';

describe('StatisticsService', () => {
    let service: StatisticsService;
    let pollModel: Model<Poll>;
    let pollEventModel: Model<PollEvent>;
    let participantModel: Model<Participant>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                StatisticsModule,
            ],
        }).compile();

        pollModel = module.get('PollModel');
        pollEventModel = module.get('PollEventModel');
        participantModel = module.get('ParticipantModel');
        service = module.get<StatisticsService>(StatisticsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get empty statistics', async () => {
        const statistics = await service.getStats();
        expect(statistics).toBeDefined();
        expect(statistics.polls).toEqual(0);
        expect(statistics.pollEvents).toEqual(0);
        expect(statistics.participants).toEqual(0);
        expect(statistics.users).toEqual(0);
    });

    it('should get statistics', async () => {
        const pollStub = PollStub();
        const pollEvent = PollEventStub();
        const participant = ParticipantStub();
        await (new pollModel(pollStub)).save();
        await (new pollEventModel(pollEvent)).save();
        await (new participantModel(participant)).save();

        const statistics = await service.getStats();
        expect(statistics.polls).toEqual(1);
        expect(statistics.pollEvents).toEqual(1);
        expect(statistics.participants).toEqual(1);
        expect(statistics.users).toEqual(1);
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
