import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsBoolean, IsDate, IsOptional, IsPositive} from 'class-validator';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({_id: false, id: false, timestamps: false})
export class Settings {
    @Prop({index: 1})
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    deadline?: Date;

    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxParticipants?: number;

    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxParticipantEvents?: number;

    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxEventParticipants?: number;

    @ApiProperty()
    @IsBoolean()
    allowMaybe: boolean;

    @ApiProperty()
    @IsBoolean()
    allowEdit: boolean;

    @ApiProperty()
    @IsBoolean()
    anonymous: boolean;

    @ApiProperty()
    @IsBoolean()
    blindParticipation: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
