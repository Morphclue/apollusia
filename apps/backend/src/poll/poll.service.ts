import {Poll, ReadStatsPollDto} from '@apollusia/types';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, QueryOptions} from 'mongoose';

import {environment} from '../environment';

@Injectable()
export class PollService extends MongooseRepository<Poll> {
  constructor(
    @InjectModel(Poll.name) public model: Model<Poll>,
  ) {
    super(model);
  }

  async getPolls(token: string, user: string | undefined, active: boolean | undefined, options?: QueryOptions<Poll>): Promise<ReadStatsPollDto[]> {
    return this.findAll({
      $and: [
        this.ownerFilter(token, user),
        this.activeFilter(active),
      ],
    }, options) as any;
  }

  private activeFilter(active: boolean | undefined): FilterQuery<Poll> {
    if (active === undefined) {
      return {};
    }
    const date = new Date(Date.now() - environment.polls.activeDays * 24 * 60 * 60 * 1000);
    return active ? {
      $or: [
        {'settings.deadline': {$gt: date}},
        {'settings.deadline': {$exists: false}},
        {'settings.deadline': null},
      ],
    } : {
      'settings.deadline': {$ne: null, $lte: date},
    };
  }

  private ownerFilter(token: string, user: string | undefined) {
    return user ? {$or: [{createdBy: user}, {adminToken: token}]} : {adminToken: token};
  }

  isAdmin(poll: Poll, token: string | undefined, user: string | undefined) {
    return poll.adminToken === token || poll.createdBy === user;
  }
}
