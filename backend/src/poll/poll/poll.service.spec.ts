import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';

import {PollStub} from '../../../test/stubs/PollStub';
import {Poll} from '../../schema';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {PollModule} from '../poll.module';
import {PollService} from './poll.service';

describe('PollService', () => {
    let service: PollService;
    let pollModel: Model<Poll>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                PollModule,
            ],
        }).compile();

        pollModel = module.get('PollModel');
        service = module.get<PollService>(PollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create poll', async () => {
        const poll = await service.postPoll(PollStub());
        const pollCounts = await pollModel.countDocuments().exec();
        expect(poll).toBeDefined();
        expect(pollCounts).toEqual(1);
    });

    it('should update poll', async () => {
        const modifiedPoll = PollStub();
        modifiedPoll.title = 'Party';
        const oldPoll = await pollModel.findOne({_id: PollStub()._id}).exec();
        await service.putPoll(modifiedPoll._id.toString(), modifiedPoll);
        const updatedPoll = await pollModel.findOne({_id: PollStub()._id}).exec();

        expect(oldPoll._id).toEqual(updatedPoll._id);
        expect(oldPoll.title).not.toEqual(updatedPoll.title);
        expect(updatedPoll.title).toEqual('Party');
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
