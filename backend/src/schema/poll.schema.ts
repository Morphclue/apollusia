import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';
import {Types} from 'mongoose';

import {RefArray} from './ref.decorator';
import {Settings} from './settings';

@Schema()
export class Poll {
    @ApiProperty()
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

    @Prop({required: true})
    adminMail?: string;

    @Prop()
    @ApiProperty()
    @Type(() => Settings)
    @ValidateNested()
    settings: Settings;

    @RefArray('PollEvent')
    bookedEvents: Types.ObjectId[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
