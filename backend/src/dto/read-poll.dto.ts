import {OmitType} from '@nestjs/swagger';

import {Poll} from '../schema';

const excludedProperties = ['adminToken', 'adminMail'] as const;
export const readPollSelect = excludedProperties.map(s => '-' + s).join(' ');

export class ReadPollDto extends OmitType(Poll, excludedProperties) {
}

export class ReadStatsPollDto extends ReadPollDto {
    events: number;
    participants: number;
}

