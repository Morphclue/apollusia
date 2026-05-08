import {Ref} from '@mean-stream/nestx/ref';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {SchemaTypes, Types} from 'mongoose';

import {Participant} from './participant.schema';
import {Poll} from './poll.schema';

export class Comment {
  @Prop()
  name: string;

  @Prop()
  body: string;
}

export class ParticipantLog {
  @Prop()
  name?: string;

  @Ref(Participant.name)
  participant: Types.ObjectId;
}

export class EventsChangedLog {
  @Prop()
  created?: number;

  @Prop()
  updated?: number;

  @Prop()
  deleted?: number;
}

export class PollBookedLog {
  @Prop()
  booked: number;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class PollLog {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({format: 'uuid'})
  @Prop({required: false, type: SchemaTypes.UUID, transform: (v: object) => v.toString()})
  createdBy?: string;

  @Ref(Poll.name, {index: 1})
  poll: Types.ObjectId;

  @Prop({type: String, index: 1})
  type: 'comment' | 'participant.created' | 'events.changed' | 'poll.booked';

  @Prop({type: Object})
  data: Comment | ParticipantLog | EventsChangedLog | PollBookedLog;
}

export const PollLogSchema = SchemaFactory.createForClass(PollLog);
