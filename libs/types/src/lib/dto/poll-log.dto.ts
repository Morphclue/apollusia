import {PickType} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {Equals, IsInstance} from 'class-validator';

import {Comment, PollLog} from '../schema';

export class CreatePollLogDto extends PickType(PollLog, ['type', 'data'] as const) {
  @Equals('comment')
  type: 'comment';

  @IsInstance(Comment)
  @Type(() => Comment)
  data: Comment;
}
