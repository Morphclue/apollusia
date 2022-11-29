import {Test, TestingModule} from '@nestjs/testing';

import {rootMongooseTestModule} from '../../utils/mongo-util';
import {PollModule} from '../poll.module';
import {PollService} from './poll.service';

describe('PollService', () => {
    let service: PollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                PollModule,
            ],
        }).compile();

        service = module.get<PollService>(PollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
