import {Ref} from '@mean-stream/nestx';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsDate, IsOptional, IsString} from 'class-validator';
import {Types} from 'mongoose';

import {Poll} from './poll.schema';
import {Transform} from "class-transformer";

@Schema()
export class PollEvent {
    @ApiProperty()
    _id: Types.ObjectId;

    @Ref(Poll.name, {index: 1})
    poll: Types.ObjectId;

    @Prop({required: true, index: 1})
    @ApiProperty()
    @Transform(({value}) => new Date(value))
    @IsDate()
    start: Date;

    @Prop({required: true})
    @ApiProperty()
    @Transform(({value}) => new Date(value))
    @IsDate()
    end: Date;

    @Prop()
    @IsOptional()
    @IsString()
    note?: string;
}

export const PollEventSchema = SchemaFactory.createForClass(PollEvent);
