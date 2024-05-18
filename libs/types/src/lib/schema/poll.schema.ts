import 'base64-js'; // FIXME needs explicit import because nx does not detect it in objectIdToBase64
import {objectIdToBase64, RefArray} from '@mean-stream/nestx/ref';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsObject, IsOptional, IsString, IsTimeZone, MinLength, ValidateNested} from 'class-validator';
import {Types} from 'mongoose';
import {Settings, SettingsSchema} from './settings';

@Schema({
  timestamps: true,
  minimize: false, // for settings
  id: false,
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
  virtuals: {
    id: {
      get: function (this: Poll) {
        return objectIdToBase64(this._id);
      },
    },
    participants: {
      options: {
        ref: 'Participant',
        localField: '_id',
        foreignField: 'poll',
        count: true,
      },
    },
    events: {
      options: {
        ref: 'PollEvent',
        localField: '_id',
        foreignField: 'poll',
        count: true,
      },
    },
  },
})
export class Poll {
    @ApiProperty()
    _id: Types.ObjectId;

    @ApiProperty()
    id: string;

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
    @IsTimeZone()
    timeZone?: string;

    @Prop({required: true, index: 1})
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

    @Prop({type: SettingsSchema, default: {}})
    @ApiProperty()
    @Type(() => Settings)
    @ValidateNested()
    settings: Settings;

    @Prop({type: Object})
    @ApiProperty()
    @IsObject()
    bookedEvents: Record<string, Types.ObjectId[] | true>;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
