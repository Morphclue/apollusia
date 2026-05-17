import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';

import {Poll} from '../schema';

export class CreatePollDto extends OmitType(Poll, [
  'id',
  '_id',
  'createdAt',
  'updatedAt',
] as const) {
}

export class UpdatePollDto extends PartialType(CreatePollDto) {
}

export const readPollExcluded = ['adminToken'] as const;
export const readPollSelect = readPollExcluded.map(s => '-' + s).join(' ');
export const readPollPopulate = ['events', 'participants', 'comments'];

export class ReadPollDto extends OmitType(Poll, readPollExcluded) {
}

export class ReadStatsPollDto extends ReadPollDto {
  @ApiProperty()
  events: number;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  comments: number;
}
