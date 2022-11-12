import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';
import mongoose, { Types } from 'mongoose';

import {Poll} from './poll.schema';

@Schema()
export class PollEvent {
    _id: Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    poll: Poll;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    start: string;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    end: string;

    @Prop()
    @IsString()
    note: string;
}

export const PollEventSchema = SchemaFactory.createForClass(PollEvent);
