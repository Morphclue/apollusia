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

@Controller('poll/:poll/events')
export class PollEventController {
  constructor(
    private pollService: PollActionsService,
  ) {
  }

  @Get()
  async getEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
  ): Promise<ReadPollEventDto[]> {
    await this.pollService.find(poll) ?? notFound(poll);
    return this.pollService.getEvents(poll);
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
    if (!this.pollService.isAdmin(pollDoc, token, user?.sub)) {
      throw new ForbiddenException('You are not allowed to edit events for this poll');
    }
    return this.pollService.postEvents(poll, pollEvents);
  }

}
