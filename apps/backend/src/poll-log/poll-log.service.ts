import {PollLog} from '@apollusia/types';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class PollLogService extends MongooseRepository<PollLog> {
  constructor(
    @InjectModel(PollLog.name) model: Model<PollLog>,
  ) {
    super(model);
  }
}
