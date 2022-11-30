import {NotFoundException} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {Model, Types} from 'mongoose';

import {ParticipantStub, PollStub} from '../../../test/stubs';
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

    it('should get poll', async () => {
        const poll = await service.getPoll(PollStub()._id.toString());
        expect(poll).toBeDefined();
    });

    it('should get all polls', async () => {
        const polls = await service.getPolls(ParticipantStub().token);
        expect(polls).toBeDefined();
        expect(polls.length).toEqual(1);
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

    it('should not update poll', async () => {
        const modifiedPoll = PollStub();
        modifiedPoll._id = new Types.ObjectId('9e9e9e9e9e9e9e9e9e9e9e9e');
        modifiedPoll.title = 'Meeting';

        const oldPoll = await pollModel.findOne({_id: PollStub()._id}).exec();
        await expect(service.putPoll(modifiedPoll._id.toString(), modifiedPoll)).rejects.toThrow(NotFoundException);
        const updatedPoll = await pollModel.findOne({_id: PollStub()._id}).exec();
        const pollCounts = await pollModel.countDocuments().exec();

        expect(oldPoll.title).toEqual(updatedPoll.title);
        expect(updatedPoll.title).not.toEqual('Meeting');
        expect(pollCounts).toEqual(1);
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
