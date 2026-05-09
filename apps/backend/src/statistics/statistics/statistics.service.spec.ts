import {Participant, Poll, PollEvent} from '@apollusia/types';
import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';

import {StatisticsService} from './statistics.service';
import {ParticipantStub, PollEventStub, PollStub} from '../../../test/stubs';
import {StatisticsModule} from '../statistics.module';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let pollModel: Model<Poll>;
  let pollEventModel: Model<PollEvent>;
  let participantModel: Model<Participant>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URI + 'StatisticsService'),
        StatisticsModule,
      ],
    }).compile();

    pollModel = module.get('PollModel');
    pollEventModel = module.get('PollEventModel');
    participantModel = module.get('ParticipantModel');
    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should get empty statistics', async () => {
    const statistics = await service.getStats();
    expect(statistics).toBeDefined();
    expect(statistics.polls).toEqual(0);
    expect(statistics.pollEvents).toEqual(0);
    expect(statistics.participants).toEqual(0);
    expect(statistics.users).toEqual(0);
  });

  it('should get statistics', async () => {
    const pollStub = await pollModel.create(PollStub());
    const sharedTokenPoll = await pollModel.create(PollStub());
    const pollOnlyTokenPoll = await pollModel.create(PollStub());
    const sharedToken = 'shared-token';
    const pollOnlyToken = 'poll-only-token';
    const participantOnlyToken = 'participant-only-token';

    await pollModel.updateOne({_id: sharedTokenPoll._id}, {$set: {token: sharedToken}}, {strict: false});
    await pollModel.updateOne({_id: pollOnlyTokenPoll._id}, {$set: {token: pollOnlyToken}}, {strict: false});
    await pollEventModel.create({poll: pollStub._id, ...PollEventStub()});
    await participantModel.create({poll: pollStub._id, ...ParticipantStub(), token: sharedToken});
    await participantModel.create({
      poll: pollStub._id,
      ...ParticipantStub(),
      name: 'Second Participant',
      token: participantOnlyToken,
    });

    const statistics = await service.getStats();
    expect(statistics.polls).toEqual(3);
    expect(statistics.pollEvents).toEqual(1);
    expect(statistics.participants).toEqual(2);
    expect(statistics.users).toEqual(3);
  });
});
