import {PollLog} from '@apollusia/types';
import {CreatePollLogDto} from '@apollusia/types/lib/dto/poll-log.dto';
import {Auth, AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {Body, Controller, Get, MessageEvent, Param, Post, Query, Sse} from '@nestjs/common';
import {Types} from 'mongoose';
import {map, Observable} from 'rxjs';

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
    @Query('createdBefore') createdBefore?: string,
  ): Promise<PollLog[]> {
    return this.pollLogService.findAll({
      poll,
      ...(createdBefore && {createdAt: {$lt: new Date(createdBefore)}}),
    }, {
      limit: 100,
    });
  }

  @Sse('events')
  streamEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
  ): Observable<MessageEvent> {
    return this.pollLogService.subscribe(poll).pipe(map(log => ({
      data: log,
    })));
  }

  @Post()
  @Auth()
  async postComment(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Body() body: CreatePollLogDto,
    @AuthUser() user: UserToken,
  ): Promise<PollLog> {
    return this.pollLogService.create({
      poll,
      createdBy: user.sub,
      ...body,
    });
  }
}
