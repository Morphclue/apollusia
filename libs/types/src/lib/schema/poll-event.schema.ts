import {Ref} from '@mean-stream/nestx/ref';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';
import {Types} from 'mongoose';

import {Poll} from './poll.schema';

@Schema()
export class PollEvent {
    @ApiProperty()
    _id: Types.ObjectId;

    @Ref(Poll.name, {index: 1})
    poll: Types.ObjectId;

    @Prop({required: true, index: 1})
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
