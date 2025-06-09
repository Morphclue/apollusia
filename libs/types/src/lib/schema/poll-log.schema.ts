import {Ref} from '@mean-stream/nestx/ref';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested} from 'class-validator';
import {SchemaTypes, Types} from 'mongoose';

import {Participant} from './participant.schema';
import {Poll} from './poll.schema';

export class Comment {
  @Prop()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class ParticipantLog {
  @Prop()
  @IsOptional()
  @IsString()
  name?: string;

  @Ref(Participant.name)
  participant: Types.ObjectId;
}

export class EventLog {
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
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @Ref(Poll.name, {index: 1})
  poll: Types.ObjectId;

  @Prop({type: String, index: 1})
  type: 'comment' | 'participant.created' | 'events.changed' | 'poll.booked';

  @Prop({type: Object})
  @ValidateNested()
  @Type(() => Object, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        {name: 'comment', value: Comment},
        {name: 'participant.created', value: ParticipantLog},
        {name: 'events.changed', value: EventLog},
        {name: 'poll.booked', value: PollBookedLog},
      ],
    },
  })
  data: Comment | ParticipantLog | EventLog | PollBookedLog;
}

export const PollLogSchema = SchemaFactory.createForClass(PollLog);
