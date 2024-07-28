import {Poll, PollEventDto} from '@apollusia/types';
import {NotFoundException} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Model, Types} from 'mongoose';

import {PollActionsService} from './poll-actions.service';
import {PollModule} from './poll.module';
import {ParticipantStub, PollEventStub, PollStub} from '../../test/stubs';

describe('PollActionsService', () => {
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

  let pollStubId;

  it('should create poll', async () => {
    const poll = await service.postPoll(PollStub());
    expect(poll).toBeDefined();
    expect(poll._id).toBeDefined();

    pollStubId = poll._id;
  });

  it('should get poll', async () => {
    const poll = await service.getPoll(pollStubId);
    expect(poll).toBeDefined();
  });

  it('should get all polls', async () => {
    const polls = await service.getPolls(PollStub().adminToken, undefined, true);
    expect(polls).toBeDefined();
    expect(polls.length).toEqual(1);
  });

  it('should update poll', async () => {
    const modifiedPoll = PollStub();
    modifiedPoll.title = 'Party';

    const updatedPoll = await service.putPoll(pollStubId, modifiedPoll);
    expect(updatedPoll.title).toEqual('Party');
  });

  it('should not update poll', async () => {
    const modifiedPoll = PollStub();
    modifiedPoll.title = 'Meeting';
    const modifiedPollId = new Types.ObjectId('9e9e9e9e9e9e9e9e9e9e9e9e');

    expect(await service.putPoll(modifiedPollId, modifiedPoll)).toBeNull();
    const updatedPoll = await pollModel.findById(pollStubId).exec();
    const pollCounts = await pollModel.countDocuments().exec();

    expect(updatedPoll.title).not.toEqual('Meeting');
    expect(pollCounts).toEqual(1);
  });

  it('should clone poll', async () => {
    let pollCounts = await pollModel.countDocuments().exec();
    expect(pollCounts).toEqual(1);

    const clonedPoll = await service.clonePoll(pollStubId);
    pollCounts = await pollModel.countDocuments().exec();

    expect(clonedPoll).toBeDefined();
    expect(clonedPoll._id).not.toEqual(pollStubId);
    expect(pollCounts).toEqual(2);
  });

  it('should delete poll', async () => {
    let pollCounts = await pollModel.countDocuments().exec();
    expect(pollCounts).toEqual(2);

    await service.deletePoll(pollStubId);
    pollCounts = await pollModel.countDocuments().exec();

    expect(pollCounts).toEqual(1);
  });

  it('should not delete poll', async () => {
    let pollCounts = await pollModel.countDocuments().exec();
    expect(pollCounts).toEqual(1);

    expect(await service.deletePoll(pollStubId)).toBeNull();
    pollCounts = await pollModel.countDocuments().exec();

    expect(pollCounts).toEqual(1);
  });

  it('should add events to poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    let pollEventCount = await pollEventModel.countDocuments().exec();
    expect(pollEventCount).toEqual(0);
    const event = await service.postEvents(poll._id, [PollEventStub()] as any);

    pollEventCount = await pollEventModel.countDocuments().exec();
    expect(event[0].poll).toEqual(poll._id);
    expect(pollEventCount).toEqual(1);
  });

  it('should get events from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    const events = await service.getEvents(poll._id);
    expect(events.length).toEqual(1);
  });

  it('should delete events from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    const events = await service.postEvents(poll._id, []);
    expect(events.length).toEqual(0);
  });

  it('should not get participants from poll', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    const participants = await service.getParticipants(poll._id, ParticipantStub().token);
    expect(participants.length).toEqual(0);
  });

  it('should post participation', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    await service.postParticipation(poll._id, ParticipantStub());
    const participants = await service.getParticipants(poll._id, ParticipantStub().token);
    expect(participants.length).toEqual(1);
  });

  it('should not post participation', async () => {
    await expect(service.postParticipation(
      new Types.ObjectId('5f1f9b9b9b9b942b9b9b9b9b'),
      ParticipantStub())
    ).rejects.toThrow(NotFoundException);
  });

  it('should be admin', async () => {
    const poll = await pollModel.findOne({title: 'Party (clone)'}).exec();
    const isAdmin = service.isAdmin(poll, ParticipantStub().token, undefined);
    expect(isAdmin).toEqual(true);
  });
});
