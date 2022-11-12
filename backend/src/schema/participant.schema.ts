import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {Types} from 'mongoose';
import * as mongoose from 'mongoose';
import {PollEvent} from './poll-event.schema';

import {Poll} from './poll.schema';

@Schema()
export class Participant {
    _id: Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    poll: Poll;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    @ApiProperty()
    participation: PollEvent[];

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    @ApiProperty()
    indeterminateParticipation: PollEvent[];

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @Prop()
    @ApiProperty()
    @IsEmail()
    mail: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
