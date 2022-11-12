import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';
import mongoose, {Types} from 'mongoose';

import {Settings} from '../dto';
import {PollEvent} from './poll-event.schema';

@Schema()
export class Poll {
    _id: Types.ObjectId;

    @Prop({required: true})
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title: string;

    @Prop()
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @Prop()
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    location?: string;

    @Prop({required: true})
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adminToken: string;

    @Prop()
    @ApiProperty()
    @Type(() => Settings)
    @ValidateNested()
    settings: Settings;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    @ApiProperty()
    bookedEvents: PollEvent[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
