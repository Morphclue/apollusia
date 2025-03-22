import {PollLog} from '@apollusia/types';
import {CreatePollLogDto} from '@apollusia/types/lib/dto/poll-log.dto';
import {AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {notFound} from '@mean-stream/nestx/not-found';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {Body, Controller, Get, MessageEvent, Param, ParseIntPipe, Post, Query, Sse, UseGuards} from '@nestjs/common';
import {Types} from 'mongoose';
import {map, Observable} from 'rxjs';

import {KeycloakService} from '../auth/keycloak.service';
import {OptionalAuthGuard} from '../auth/optional-auth.guard';
import {environment} from '../environment';
import {PollLogService} from './poll-log.service';
import {PollService} from '../poll/poll.service';
import {PushService} from '../push/push.service';

@Controller('poll/:poll/log')
export class PollLogController {
  constructor(
    private pollService: PollService,
    private pollLogService: PollLogService,
    private pushService: PushService,
    private keycloakService: KeycloakService,
  ) {
  }

  @Get()
  async getEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Query('createdBefore') createdBefore?: string,
    @Query('limit', new ParseIntPipe({optional: true})) limit = 100,
  ): Promise<PollLog[]> {
    return (await this.pollLogService.findAll({
      poll,
      ...(createdBefore && {createdAt: {$lt: new Date(createdBefore)}}),
    }, {
      limit,
      sort: {createdAt: -1}, // sort by latest first to get the latest events
    })).reverse(); // then reverse
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
  @UseGuards(OptionalAuthGuard)
  async postComment(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Body() body: CreatePollLogDto,
    @AuthUser() user?: UserToken,
  ): Promise<PollLog> {
    const pollDoc = await this.pollService.find(poll) ?? notFound(poll);
    const kcUser = pollDoc.createdBy && await this.keycloakService.getUser(pollDoc.createdBy);
    if (kcUser && this.pushService.hasNotificationEnabled(kcUser, 'admin:comment.new:push')) {
      this.pushService.send(
        kcUser,
        `New Comment in Poll: ${pollDoc.title}`,
        `${body.data.name} commented in your poll: ${body.data.body}`,
        `${environment.origin}/poll/${poll}/participate`,
      ).catch(console.error);
    }
    return this.pollLogService.create({
      poll,
      createdBy: user?.sub,
      ...body,
    });
  }
}
