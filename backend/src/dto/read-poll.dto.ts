import {OmitType} from '@nestjs/swagger';

import {Poll} from '../schema';

export class ReadPollDto extends OmitType(Poll, ['adminToken']) {
}

export class ReadStatsPollDto extends ReadPollDto {
    events: number;
    participants: number;
}

