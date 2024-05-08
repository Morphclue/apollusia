import {
  MailDto,
  Participant,
  CreateParticipantDto,
  PollDto,
  PollEvent,
  PollEventDto,
  ReadParticipantDto,
  ReadPollDto,
  ReadStatsPollDto,
  UpdateParticipantDto, ReadPollEventDto,
} from '@apollusia/types';
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
  ParseArrayPipe,
  ParseBoolPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {Types} from 'mongoose';

import {PollService} from './poll.service';


@Controller('poll')
export class PollController {
    constructor(private readonly pollService: PollService) {
    }

    @Get('')
    async getPolls(
      @Headers('Participant-Token') token: string,
      @Query('participated', new DefaultValuePipe(false), ParseBoolPipe) participated: boolean,
      @Query('active') active?: string,
    ): Promise<ReadStatsPollDto[]> {
      if (participated) {
        return this.pollService.getParticipatedPolls(token);
      }
      return this.pollService.getPolls(token, active !== undefined ? active === 'true' : undefined);
    }

    @Get(':id/admin/:token')
    async isAdmin(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Param('token') token: string): Promise<boolean> {
        return this.pollService.isAdmin(id, token);
    }

    @Get(':id')
    async getPoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto> {
        return this.pollService.getPoll(id);
    }

    @Post()
    async postPoll(@Body() pollDto: PollDto): Promise<ReadPollDto> {
        return this.pollService.postPoll(pollDto);
    }

    @Put(':id')
    async putPoll(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Body() pollDto: PollDto): Promise<ReadPollDto> {
        return this.pollService.putPoll(id, pollDto);
    }

    @Post(':id/clone')
    async clonePoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto> {
        const poll = await this.pollService.getPoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }

        return this.pollService.clonePoll(id);
    }

    @Delete(':id')
    async deletePoll(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollDto | undefined> {
        const poll = await this.pollService.deletePoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }

        return poll;
    }

    @Get(':id/events')
    async getEvents(@Param('id', ObjectIdPipe) id: Types.ObjectId): Promise<ReadPollEventDto[]> {
        const poll = await this.pollService.getPoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }

        return this.pollService.getEvents(id);
    }

    @Post(':id/events')
    async postEvents(
      @Param('id', ObjectIdPipe) id: Types.ObjectId,
      @Body(new ParseArrayPipe({items: PollEventDto})) pollEvents: PollEventDto[],
    ): Promise<PollEvent[]> {
        const poll = await this.pollService.getPoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }

        return this.pollService.postEvents(id, pollEvents);
    }

    @Get(':id/participate')
    async getParticipants(
        @Param('id', ObjectIdPipe) id: Types.ObjectId,
        @Headers('Participant-Token') token: string,
    ): Promise<ReadParticipantDto[]> {
        return this.pollService.getParticipants(id, token);
    }

    @Post(':id/participate')
    async postParticipation(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Body() participant: CreateParticipantDto): Promise<Participant> {
        return this.pollService.postParticipation(id, participant);
    }

    @Put('mail/participate')
    async setMail(@Body() mailDto: MailDto): Promise<void> {
        return this.pollService.setMail(mailDto);
    }

    @Put(':id/participate/:participantId')
    async editParticipation(
        @Param('id', ObjectIdPipe) id: Types.ObjectId,
        @Param('participantId', ObjectIdPipe) participantId: Types.ObjectId,
        @Headers('Participant-Token') token: string,
        @Body() participant: UpdateParticipantDto,
    ): Promise<ReadParticipantDto | null> {
        return this.pollService.editParticipation(id, participantId, token, participant);
    }

    @Delete(':id/participate/:participantId')
    async deleteParticipation(
        @Param('id', ObjectIdPipe) id: Types.ObjectId,
        @Param('participantId', ObjectIdPipe) participantId: Types.ObjectId,
    ): Promise<ReadParticipantDto | null> {
        return this.pollService.deleteParticipation(id, participantId);
    }

    @Post(':id/book')
    async bookEvents(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Body() events: string[]): Promise<ReadPollDto> {
        const poll = await this.pollService.getPoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }

        return this.pollService.bookEvents(id, events.map(e => new Types.ObjectId(e)));
    }
}
