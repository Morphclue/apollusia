import {Poll} from '@apollusia/types';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class PollService extends MongooseRepository<Poll> {
  constructor(
    @InjectModel(Poll.name) model: Model<Poll>,
  ) {
    super(model);
  }
}
