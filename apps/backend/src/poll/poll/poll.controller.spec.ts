import {Test, TestingModule} from '@nestjs/testing';

import {PollController} from './poll.controller';
import {PollService} from './poll.service';
import {PollStub} from '../../../test/stubs';
import {rootMongooseTestModule} from '../../utils/mongo-util';
import {PollModule} from '../poll.module';

describe('PollController', () => {
    let controller: PollController;
    let service: PollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                PollModule,
            ],
        }).compile();

        controller = module.get<PollController>(PollController);
        service = module.get<PollService>(PollService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call postPoll', async () => {
      jest.spyOn(service, 'postPoll')
      await controller.postPoll(PollStub());
      expect(service.postPoll).toHaveBeenCalled();
    });

    it('should call getPoll', async () => {
      jest.spyOn(service, 'getPoll')
      await controller.getPoll(PollStub()._id);
      expect(service.getPoll).toHaveBeenCalled();
    });
});
