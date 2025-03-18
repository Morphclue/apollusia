import {PollLog} from '@apollusia/types';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {Controller, Get, Param} from '@nestjs/common';
import {Types} from 'mongoose';

import {PollLogService} from './poll-log.service';

@Controller('poll/:poll/log')
export class PollLogController {
  constructor(
    private pollLogService: PollLogService,
  ) {
  }

  @Get()
  async getEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
  ): Promise<PollLog[]> {
    return this.pollLogService.findAll({poll});
  }
}
