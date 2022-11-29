import {Test, TestingModule} from '@nestjs/testing';

import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {StatisticsModule} from '../statistics.module';
import {StatisticsController} from './statistics.controller';

describe('StatisticsController', () => {
    let controller: StatisticsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                StatisticsModule,
            ],
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
