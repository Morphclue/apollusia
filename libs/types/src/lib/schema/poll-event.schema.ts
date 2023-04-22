import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';
import {Types} from 'mongoose';

import {Poll} from './poll.schema';
import {Ref} from '../ref.decorator';

@Schema()
export class PollEvent {
    @ApiProperty()
    _id: Types.ObjectId;

    @Ref(Poll.name)
    poll: Types.ObjectId;

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
