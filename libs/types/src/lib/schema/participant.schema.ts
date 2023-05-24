import {Ref} from '@mean-stream/nestx';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, MinLength} from 'class-validator';
import {Types} from 'mongoose';

import {Poll} from './poll.schema';

export type PollEventState = 'yes' | 'no' | 'maybe';

@Schema({
  timestamps: true,
  // NB: this is required to retain selection: {} when it is empty
  minimize: false,
})
export class Participant {
    @ApiProperty()
    _id: Types.ObjectId;

    @ApiPropertyOptional()
    createdAt?: Date;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @Ref(Poll.name)
    poll: Types.ObjectId;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @Prop({type: Object, default: {}})
    @IsObject()
    @ApiProperty({description: 'Record from PollEvent ID to state'})
    selection: Partial<Record<string, PollEventState>>;

    /** @deprecated */
    @Prop({type: [Types.ObjectId], default: undefined})
    participation?: Types.ObjectId[];

    /** @deprecated */
    @Prop({type: [Types.ObjectId], default: undefined})
    indeterminateParticipation?: Types.ObjectId[];

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @Prop()
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    mail?: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
