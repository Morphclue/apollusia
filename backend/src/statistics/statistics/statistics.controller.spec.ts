import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../../schema';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {StatisticsController} from './statistics.controller';
import {StatisticsService} from './statistics.service';

describe('StatisticsController', () => {
    let controller: StatisticsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: Poll.name, schema: PollSchema},
                    {name: PollEvent.name, schema: PollEventSchema},
                    {name: Participant.name, schema: ParticipantSchema},
                ]),
            ],
            controllers: [StatisticsController],
            providers: [StatisticsService],
        }).compile();

        controller = module.get<StatisticsController>(StatisticsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
