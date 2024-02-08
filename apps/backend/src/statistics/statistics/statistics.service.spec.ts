import {Participant, Poll, PollEvent} from '@apollusia/types';
import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Model} from 'mongoose';

import {StatisticsService} from './statistics.service';
import {ParticipantStub, PollEventStub, PollStub} from '../../../test/stubs';
import {StatisticsModule} from '../statistics.module';

describe('StatisticsService', () => {
  let mongoServer: MongoMemoryServer;
    let service: StatisticsService;
    let pollModel: Model<Poll>;
    let pollEventModel: Model<PollEvent>;
    let participantModel: Model<Participant>;

    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();

      const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongoServer.getUri()),
                StatisticsModule,
            ],
        }).compile();

        pollModel = module.get('PollModel');
        pollEventModel = module.get('PollEventModel');
        participantModel = module.get('ParticipantModel');
        service = module.get<StatisticsService>(StatisticsService);
    });

    afterAll(async () => {
      await mongoServer?.stop();
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
});
