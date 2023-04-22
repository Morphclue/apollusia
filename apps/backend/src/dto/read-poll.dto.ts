import {ApiProperty, OmitType} from '@nestjs/swagger';

import {Poll} from '@apollusia/types';

export const readPollExcluded = ['adminToken', 'adminMail', 'adminPush'] as const;
export const readPollSelect = readPollExcluded.map(s => '-' + s).join(' ');

export class ReadPollDto extends OmitType(Poll, readPollExcluded) {
}

export class ReadStatsPollDto extends ReadPollDto {
    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    events: number;

    @ApiProperty()
    participants: number;
}
