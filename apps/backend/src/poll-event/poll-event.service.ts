import {PollEvent} from '@apollusia/types';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class PollEventService extends MongooseRepository<PollEvent> {
  constructor(
    @InjectModel(PollEvent.name) public model: Model<PollEvent>,
  ) {
    super(model);
  }
}
