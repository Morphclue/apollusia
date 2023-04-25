import {OmitType} from '@nestjs/swagger';

import {Poll} from '../schema';

export class PollDto extends OmitType(Poll, ['_id'] as const) {
}
