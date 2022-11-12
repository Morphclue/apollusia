import {ApiProperty, OmitType} from '@nestjs/swagger';

import {Poll} from '../schema';

export class ReadPollDto extends OmitType(Poll, ['adminToken']) {
}

export class ReadStatsPollDto extends ReadPollDto {
    @ApiProperty()
    events: number;

    @ApiProperty()
    participants: number;
}
