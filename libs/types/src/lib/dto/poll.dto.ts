import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';

import {Poll, PollRole} from '../schema';

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
export const readPollPopulate = ['events', 'participants', 'comments'];

// which properties should be included in poll.changed log event:
export const updatePollDiff: (keyof Poll)[] = [
  'title',
  'description',
  'location',
  'timeZone',
  'settings',
];

export class ReadPollDto extends OmitType(Poll, readPollExcluded) {
  /** This is injected by the backend for determining your role */
  @ApiProperty()
  adminRole?: PollRole;
}

export class ReadStatsPollDto extends ReadPollDto {
  @ApiProperty()
  events: number;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  comments: number;
}
