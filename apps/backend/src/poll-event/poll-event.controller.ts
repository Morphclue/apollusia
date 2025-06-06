import {PollEvent, PollEventDto, ReadPollEventDto} from '@apollusia/types';
import {AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {notFound} from '@mean-stream/nestx/not-found';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {Types} from 'mongoose';

import {OptionalAuthGuard} from '../auth/optional-auth.guard';
import {PollActionsService} from '../poll/poll-actions.service';
import {PollService} from '../poll/poll.service';

@Controller('poll/:poll/events')
export class PollEventController {
  constructor(
    private pollService: PollService,
    private pollActionsService: PollActionsService,
  ) {
  }

  @Get()
  async getEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
  ): Promise<ReadPollEventDto[]> {
    if (!await this.pollService.exists(poll)) {
      notFound(poll);
    }
    return this.pollActionsService.getEvents(poll);
  }

  @Post()
  @UseGuards(OptionalAuthGuard)
  async postEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Body(new ParseArrayPipe({items: PollEventDto})) pollEvents: PollEventDto[],
    @Headers('Participant-Token') token?: string,
    @AuthUser() user?: UserToken,
  ): Promise<PollEvent[]> {
    const pollDoc = await this.pollService.find(poll) ?? notFound(poll);
    if (!this.pollActionsService.isAdmin(pollDoc, token, user?.sub)) {
      throw new ForbiddenException('You are not allowed to edit events for this poll');
    }
    return this.pollActionsService.postEvents(poll, pollEvents, user);
  }

}
