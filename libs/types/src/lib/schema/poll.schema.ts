import {RefArray} from '@mean-stream/nestx';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsObject, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';
import {Types} from 'mongoose';
import {Settings} from './settings';

@Schema({timestamps: true})
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

    @Prop()
    @ApiProperty()
    @IsOptional()
    @IsString() // TODO IsTimeZone will be added to class-validator soon
    timeZone?: string;

    @Prop({required: true})
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adminToken: string;

    @Prop()
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminMail?: string;

    @Prop({type: Object})
    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    adminPush?: PushSubscriptionJSON;

    @Prop()
    @ApiProperty()
    @Type(() => Settings)
    @ValidateNested()
    settings: Settings;

    @RefArray('PollEvent')
    bookedEvents: Types.ObjectId[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
