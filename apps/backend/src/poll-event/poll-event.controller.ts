import {PollEvent, PollEventDto, ReadPollEventDto} from '@apollusia/types';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {Body, Controller, Get, Param, ParseArrayPipe, Post} from '@nestjs/common';
import {Types} from 'mongoose';
import {PollActionsService} from '../poll/poll-actions.service';
import {notFound} from '@mean-stream/nestx';

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
    await this.pollService.getPoll(poll) ?? notFound(poll);
    return this.pollService.getEvents(poll);
  }

  @Post()
  async postEvents(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Body(new ParseArrayPipe({items: PollEventDto})) pollEvents: PollEventDto[],
  ): Promise<PollEvent[]> {
    // FIXME anyone can edit events!
    await this.pollService.getPoll(poll) ?? notFound(poll);
    return this.pollService.postEvents(poll, pollEvents);
  }

}
