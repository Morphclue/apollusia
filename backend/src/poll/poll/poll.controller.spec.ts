import {Test, TestingModule} from '@nestjs/testing';

import {rootMongooseTestModule} from '../../utils/mongo-util';
import {PollModule} from '../poll.module';
import {PollController} from './poll.controller';

describe('PollController', () => {
    let controller: PollController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                PollModule,
            ],
        }).compile();

        controller = module.get<PollController>(PollController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
