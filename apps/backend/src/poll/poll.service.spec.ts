import {Poll} from '@apollusia/types';
import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Types} from 'mongoose';

import {ParticipantStub, PollStub} from '../../test/stubs';
import {PollModule} from './poll.module';
import {PollService} from './poll.service';

describe(PollService.name, () => {
  let pollService: PollService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URI + 'PollService'),
        PollModule,
      ],
    }).compile();

    pollService = module.get<PollService>(PollService);
  });

  let pollStubId: Types.ObjectId;

  it('should create poll', async () => {
    const poll = await pollService.model.create(PollStub());
    expect(poll).toBeDefined();
    expect(poll._id).toBeDefined();
    expect(poll.adminToken).toBeDefined();

    pollStubId = poll._id;
  });

  it('should get all polls', async () => {
    const polls = await pollService.getPolls(PollStub().adminToken, undefined, true);
    expect(polls).toBeDefined();
    expect(polls.length).toBeGreaterThanOrEqual(1);
    expect(polls.map(p => p._id.toString())).toContain(pollStubId.toString());
  });

  it('should be admin with matching token', () => {
    const poll = PollStub() as Poll;
    const isAdmin = pollService.isAdmin(poll, ParticipantStub().token, undefined);
    expect(isAdmin).toEqual(true);
  });

  it('should be admin when user created poll', () => {
    const poll = {
      ...PollStub(),
      createdBy: 'creator-id',
    } as Poll;
    const isAdmin = pollService.isAdmin(poll, undefined, 'creator-id');
    expect(isAdmin).toEqual(true);
  });

  it('should be admin when user is in adminRoles', () => {
    const poll = {
      ...PollStub(),
      adminRoles: {'editor-id': 'edit'},
    } as Poll;
    const isAdmin = pollService.isAdmin(poll, undefined, 'editor-id');

    expect(isAdmin).toEqual(true);
  });

  it('should not be admin without matching token or user', () => {
    const poll = {
      ...PollStub(),
      adminRoles: {'editor-id': 'edit'},
    } as Poll;
    const isAdmin = pollService.isAdmin(poll, 'wrong-token', 'other-user');

    expect(isAdmin).toEqual(false);
  });
});
