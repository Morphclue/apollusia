import {Poll, PollEventDto} from '@apollusia/types';
import {NotFoundException} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Document, Model, Types} from 'mongoose';

import {ParticipantStub, PollEventStub, PollStub} from '../../test/stubs';
import {PollActionsService} from './poll-actions.service';
import {PollModule} from './poll.module';

describe(PollActionsService.name, () => {
  let service: PollActionsService;
  let pollModel: Model<Poll>;
  let pollEventModel: Model<PollEventDto>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URI + 'PollService'),
        PollModule,
      ],
    }).compile();

    pollModel = module.get('PollModel');
    pollEventModel = module.get('PollEventModel');
    service = module.get<PollActionsService>(PollActionsService);
  });

  let pollStubId: Types.ObjectId;

  it('should create poll', async () => {
    const poll = await service.postPoll(PollStub());
    const json = (poll as unknown as Document).toJSON();

    expect(poll).toBeDefined();
    expect(poll._id).toBeDefined();
    pollStubId = poll._id;

    expect(json.adminToken).toBeUndefined();
  });

  it('should update poll', async () => {
    const modifiedPoll = PollStub();
    modifiedPoll.title = 'Party';

    const updatedPoll = await service.putPoll(pollStubId, modifiedPoll);
    expect(updatedPoll).toBeDefined();
    expect(updatedPoll!.title).toEqual('Party');
  });

  it('should not update poll', async () => {
    const modifiedPoll = PollStub();
    modifiedPoll.title = 'Meeting';
    const modifiedPollId = new Types.ObjectId('9e9e9e9e9e9e9e9e9e9e9e9e');

    const updated = await service.putPoll(modifiedPollId, modifiedPoll);
    expect(updated).toBeNull();

    const originalPoll = await pollModel.findById(pollStubId).exec();
    expect(originalPoll).toBeDefined();
    expect(originalPoll!.title).not.toEqual('Meeting');
  });

  it('should clone poll', async () => {
    const pollCounts = await pollModel.countDocuments().exec();
    const clonedPoll = await service.clonePoll(pollStubId, 'admin-token-clone');

    const pollCounts2 = await pollModel.countDocuments().exec();
    expect(clonedPoll).toBeDefined();
    expect(clonedPoll!._id).not.toEqual(pollStubId);
    // @ts-expect-error TS2339
    expect(clonedPoll!.adminToken).toEqual('admin-token-clone');
    expect(pollCounts2).toEqual(pollCounts + 1);
  });

  it('should delete poll', async () => {
    const pollCounts = await pollModel.countDocuments().exec();
    await service.deletePoll(pollStubId);

    const pollCounts2 = await pollModel.countDocuments().exec();
    expect(pollCounts2).toEqual(pollCounts - 1);
  });

  it('should not delete poll', async () => {
    const pollCounts = await pollModel.countDocuments().exec();
    expect(await service.deletePoll(pollStubId)).toBeNull();

    const pollCounts2 = await pollModel.countDocuments().exec();
    expect(pollCounts2).toEqual(pollCounts);
  });

  it('should add events to poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    expect(poll).toBeDefined();

    let pollEventCount = await pollEventModel.countDocuments().exec();
    expect(pollEventCount).toEqual(0);
    const event = await service.postEvents(poll!._id, [PollEventStub()] as any);

    pollEventCount = await pollEventModel.countDocuments().exec();
    expect(event[0].poll).toEqual(poll!._id);
    expect(pollEventCount).toEqual(1);
  });

  it('should get events from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    expect(poll).toBeDefined();

    const events = await service.getEvents(poll!._id);
    expect(events.length).toEqual(1);
  });

  it('should delete events from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    expect(poll).toBeDefined();

    const events = await service.postEvents(poll!._id, []);
    expect(events.length).toEqual(0);
  });

  it('should not get participants from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    expect(poll).toBeDefined();

    const participants = await service.getParticipants(poll!._id, ParticipantStub().token);
    expect(participants.length).toEqual(0);
  });

  it('should post participation', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    expect(poll).toBeDefined();

    await service.postParticipation(poll!._id, ParticipantStub());
    const participants = await service.getParticipants(poll!._id, ParticipantStub().token);
    expect(participants.length).toEqual(1);
  });

  it('should not post participation', async () => {
    await expect(service.postParticipation(
      new Types.ObjectId('5f1f9b9b9b9b942b9b9b9b9b'),
      ParticipantStub())
    ).rejects.toThrow(NotFoundException);
  });
});
