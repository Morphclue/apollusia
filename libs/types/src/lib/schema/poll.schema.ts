import 'base64-js'; // FIXME needs explicit import because nx does not detect it in objectIdToBase64
import {objectIdToBase64} from '@mean-stream/nestx/ref';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {SchemaTypes, Types} from 'mongoose';
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
    comments: {
      options: {
        ref: 'PollLog',
        localField: '_id',
        foreignField: 'poll',
        match: {type: 'comment'},
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

    @ApiPropertyOptional()
    createdAt?: Date;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @ApiProperty({format: 'uuid'})
    @Prop({required: false, type: SchemaTypes.UUID, transform: (v: object) => v.toString()})
    @IsOptional()
    @IsUUID()
    createdBy?: string;

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
    @IsBoolean()
    adminMail?: boolean;

    @Prop()
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    adminPush?: boolean;

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
