import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsBoolean, IsDate, IsEnum, IsOptional, IsPositive} from 'class-validator';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ShowResultOptions} from "./show-result-options";

@Schema({_id: false, id: false, timestamps: false})
export class Settings {
    @Prop({index: 1})
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    deadline?: Date;

    @Prop()
    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxParticipants?: number;

    @Prop()
    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxParticipantEvents?: number;

    @Prop()
    @ApiProperty()
    @IsOptional()
    @IsPositive()
    maxEventParticipants?: number;

    @Prop()
    @ApiProperty()
    @IsBoolean()
    allowMaybe: boolean;

    @Prop()
    @ApiProperty()
    @IsBoolean()
    allowEdit: boolean;

    @Prop()
    @ApiProperty()
    @IsBoolean()
    anonymous: boolean;

    @Prop({type: String, enum: ShowResultOptions})
    @ApiProperty({enum: ShowResultOptions})
    @IsEnum(ShowResultOptions)
    showResult: ShowResultOptions;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
