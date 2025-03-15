import {ApiProperty, OmitType} from '@nestjs/swagger';
import {Poll} from '../schema';

export class PollDto extends OmitType(Poll, ['id', '_id'] as const) {
}

export const readPollExcluded = ['adminToken'] as const;
export const readPollSelect = readPollExcluded.map(s => '-' + s).join(' ');

export class ReadPollDto extends OmitType(Poll, readPollExcluded) {
}

export class ReadStatsPollDto extends ReadPollDto {
  @ApiProperty()
  events: number;

  @ApiProperty()
  participants: number;
}
