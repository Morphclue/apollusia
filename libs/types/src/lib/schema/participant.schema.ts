import {Ref} from '@mean-stream/nestx';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, MinLength} from 'class-validator';
import {SchemaTypes, Types} from 'mongoose';

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

    @ApiProperty({format: 'uuid'})
    @Prop({required: false, type: SchemaTypes.UUID, transform: (v: object) => v.toString()})
    @IsOptional()
    @IsUUID()
    createdBy?: string;

    @Ref(Poll.name, {index: 1})
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

    @Prop({required: true, index: 1})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
