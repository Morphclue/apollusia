import {PollDto, ReadPollDto, ReadStatsPollDto} from '@apollusia/types';
import {Auth, AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {NotFound, notFound} from '@mean-stream/nestx/not-found';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {Types} from 'mongoose';

import {PollActionsService} from './poll-actions.service';
import {OptionalAuthGuard} from '../auth/optional-auth.guard';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollActionsService) {
  }

  @Get('')
  @UseGuards(OptionalAuthGuard)
  async getPolls(
    @Headers('Participant-Token') token: string,
    @Query('participated', new DefaultValuePipe(false), ParseBoolPipe) participated: boolean,
    @Query('active') active?: string,
    @AuthUser() user?: UserToken,
  ): Promise<ReadStatsPollDto[]> {
    if (participated) {
      return this.pollService.getParticipatedPolls(token);
    }
    return this.pollService.getPolls(token, user?.sub, active !== undefined ? active === 'true' : undefined);
  }

  @Get(':id/admin/:token')
  @UseGuards(OptionalAuthGuard)
  async isAdmin(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Param('token') token: string,
    @AuthUser() user?: UserToken,
  ): Promise<boolean> {
    const poll = await this.pollService.find(id) ?? notFound(id);
    return this.pollService.isAdmin(poll, token, user?.sub);
  }

  @Get(':id')
  @NotFound()
  async getPoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto | null> {
    return this.pollService.getPoll(id);
  }

  @Post()
  @UseGuards(OptionalAuthGuard)
  async postPoll(
    @Body() pollDto: PollDto,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto> {
    return this.pollService.postPoll(pollDto, user);
  }

  @Put(':id')
  @NotFound()
  async putPoll(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Body() pollDto: PollDto): Promise<ReadPollDto | null> {
    return this.pollService.putPoll(id, pollDto);
  }

  @Post(':id/clone')
  @NotFound()
  async clonePoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto | null> {
    return this.pollService.clonePoll(id);
  }

  @Delete(':id')
  @NotFound()
  async deletePoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto | null> {
    return this.pollService.deletePoll(id);
  }

  @Post('claim/:token')
  @Auth()
  async claimPolls(
    @AuthUser() user: UserToken,
    @Param('token') token: string,
  ): Promise<void> {
    return this.pollService.claimPolls(token, user.sub);
  }

  @Post(':id/book')
  @UseGuards(OptionalAuthGuard)
  async bookEvents(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Body() events: Record<string, string[] | true>,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto> {
    const poll = await this.pollService.getPoll(id);
    if (!poll) {
      throw new NotFoundException(id);
    }

    // convert nested strings to ObjectIds
    const bookedEvents = Object.fromEntries(Object
      .entries(events)
      .map(([key, value]) => [key, value === true ? true as const : value.map(v => new Types.ObjectId(v))]),
    );
    return this.pollService.bookEvents(id, bookedEvents, user);
  }
}
