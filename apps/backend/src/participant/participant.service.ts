import {Participant} from '@apollusia/types';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class ParticipantService extends MongooseRepository<Participant> {
  constructor(
    @InjectModel(Participant.name) model: Model<Participant>,
  ) {
    super(model);
  }
}
