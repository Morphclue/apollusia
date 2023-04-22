import {OmitType} from '@nestjs/swagger';

import {Poll} from '@apollusia/types';

export class PollDto extends OmitType(Poll, ['_id'] as const) {
}
