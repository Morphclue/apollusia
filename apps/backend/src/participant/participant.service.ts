import {Participant} from '@apollusia/types';
import {Doc} from '@mean-stream/nestx';
import {UserToken} from '@mean-stream/nestx/auth';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, QueryOptions, Types} from 'mongoose';

@Injectable()
export class ParticipantService extends MongooseRepository<Participant> {
  constructor(
    @InjectModel(Participant.name) public model: Model<Participant>,
  ) {
    super(model);
  }

  getOwn(poll: Types.ObjectId, token: string, user: UserToken | undefined, options?: QueryOptions<Participant>): Promise<Doc<Participant>[]> {
    return this.findAll({
      poll,
      ...(user ? {
        $or: [
          {createdBy: user.sub},
          {token},
        ],
      } : {
        token,
      }),
    }, options);
  }
}
