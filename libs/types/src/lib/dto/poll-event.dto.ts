import {ApiPropertyOptional, OmitType} from '@nestjs/swagger';
import {IsMongoId, IsOptional} from 'class-validator';

import {PollEvent} from '../schema';

export class PollEventDto extends OmitType(PollEvent, ['_id', 'poll'] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class ReadPollEventDto extends PollEvent {
  @ApiPropertyOptional()
  participants?: number;
}
