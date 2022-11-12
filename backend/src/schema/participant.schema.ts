import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsEmail, IsMongoId, IsNotEmpty, IsString, MinLength} from 'class-validator';
import * as mongoose from 'mongoose';
import {Types} from 'mongoose';
import {PollEvent} from './poll-event.schema';

import {Poll} from './poll.schema';

@Schema()
export class Participant {
    @ApiProperty()
    _id: Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    @ApiProperty()
    poll: Types.ObjectId;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: PollEvent.name,
        }],
    })
    @ApiProperty()
    @IsMongoId({each: true})
    @Transform(({value}) => value.map(s => new Types.ObjectId(s)))
    participation: Types.ObjectId[];

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: PollEvent.name,
        }],
    })
    @ApiProperty()
    @IsMongoId({each: true})
    @Transform(({value}) => value.map(s => new Types.ObjectId(s)))
    indeterminateParticipation: Types.ObjectId[];

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
