import {CreatePollDto, ReadPollDto, readPollPopulate, ReadStatsPollDto, UpdatePollDto} from '@apollusia/types';
import {Auth, AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {NotFound, notFound} from '@mean-stream/nestx/not-found';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {Types} from 'mongoose';
import {OptionalAuthGuard} from '../auth/optional-auth.guard';

import {PollActionsService} from './poll-actions.service';
import {PollService} from './poll.service';

@Controller('poll')
export class PollController {
  constructor(
    private readonly pollService: PollService,
    private readonly pollActionsService: PollActionsService,
  ) {
  }

  @Get('')
  @UseGuards(OptionalAuthGuard)
  async getPolls(
    @Headers('Participant-Token') token: string,
    @Query('participated', new DefaultValuePipe(false), ParseBoolPipe) participated: boolean,
    @Query('active') active?: string,
    @Query('populate', new ParseArrayPipe({optional: true})) populate = readPollPopulate,
    @Query('sort') sort = '-createdAt',
    @AuthUser() user?: UserToken,
  ): Promise<ReadStatsPollDto[]> {
    const options = {
      populate,
      sort,
    };
    if (participated) {
      return this.pollActionsService.getParticipatedPolls(token, options);
    }
    return this.pollService.getPolls(token, user?.sub, active !== undefined ? active === 'true' : undefined, options);
  }

  @Get(':id')
  @NotFound()
  @UseGuards(OptionalAuthGuard)
  async getPoll(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Headers('Participant-Token') token?: string,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto | null> {
    const result = await this.pollService.find(id);
    return result && {
      ...result.toJSON(),
      adminRole: this.pollService.isAdmin(result, token, user?.sub) ? 'edit' : undefined,
    };
  }

  @Post()
  @UseGuards(OptionalAuthGuard)
  async postPoll(
    @Body() pollDto: CreatePollDto,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto> {
    return this.pollActionsService.postPoll(pollDto, user);
  }

  @Put(':id')
  @UseGuards(OptionalAuthGuard)
  @NotFound()
  async putPoll(
    @Headers('Participant-Token') token: string,
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Body() pollDto: UpdatePollDto,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto | null> {
    const pollDoc = await this.pollService.find(id) ?? notFound(id);
    if (!this.pollService.isAdmin(pollDoc, token, user?.sub)) {
      throw new ForbiddenException('You are not allowed to edit this poll');
    }
    return this.pollService.update(id, pollDto, user);
  }

  @Post(':id/clone')
  @NotFound()
  @UseGuards(OptionalAuthGuard)
  async clonePoll(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Headers('Participant-Token') token: string,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto | null> {
    return this.pollActionsService.clonePoll(id, token, user);
  }

  @Delete(':id')
  @UseGuards(OptionalAuthGuard)
  @NotFound()
  async deletePoll(
    @Headers('Participant-Token') token: string,
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto | null> {
    const pollDoc = await this.pollService.find(id) ?? notFound(id);
    if (!this.pollService.isAdmin(pollDoc, token, user?.sub)) {
      throw new ForbiddenException('You are not allowed to delete this poll');
    }
    return this.pollActionsService.deletePoll(id);
  }

  @Post('claim/:token')
  @Auth()
  async claimPolls(
    @AuthUser() user: UserToken,
    @Param('token') token: string,
  ): Promise<void> {
    return this.pollActionsService.claimPolls(token, user.sub);
  }

  @Post(':id/book')
  @UseGuards(OptionalAuthGuard)
  async bookEvents(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @Body() events: Record<string, string[] | true>,
    @AuthUser() user?: UserToken,
  ): Promise<ReadPollDto> {
    if (!await this.pollService.exists({_id: id})) {
      notFound(id);
    }

    // convert nested strings to ObjectIds
    const bookedEvents = Object.fromEntries(Object
      .entries(events)
      .map(([key, value]) => [key, value === true ? true as const : value.map(v => new Types.ObjectId(v))]),
    );
    return this.pollActionsService.bookEvents(id, bookedEvents, user);
  }
}
