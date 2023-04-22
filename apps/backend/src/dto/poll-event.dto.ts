import {ApiProperty, OmitType} from '@nestjs/swagger';
import {IsMongoId} from 'class-validator';

import {PollEvent} from '@apollusia/types';

export class PollEventDto extends OmitType(PollEvent, ['_id', 'poll'] as const) {
    @ApiProperty()
    @IsMongoId()
    _id: string;
}
