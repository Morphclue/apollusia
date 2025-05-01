import {CreateParticipantDto, Participant, ReadParticipantDto, UpdateParticipantDto} from '@apollusia/types';
import {AuthUser, UserToken} from '@mean-stream/nestx/auth';
import {ObjectIdPipe} from '@mean-stream/nestx/ref';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {Types} from 'mongoose';

import {OptionalAuthGuard} from '../auth/optional-auth.guard';
import {PollActionsService} from '../poll/poll-actions.service';

@Controller('poll/:poll/participate')
export class ParticipantController {
  constructor(
    private pollService: PollActionsService,
  ) {
  }

  @Get()
  async findAll(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Headers('Participant-Token') token: string,
  ): Promise<ReadParticipantDto[]> {
    return this.pollService.getParticipants(poll, token);
  }

  @Post()
  @UseGuards(OptionalAuthGuard)
  async create(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Body() dto: CreateParticipantDto,
    @AuthUser() user?: UserToken,
  ): Promise<Participant> {
    return this.pollService.postParticipation(poll, dto, user);
  }

  @Put(':participant')
  async update(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Param('participant', ObjectIdPipe) participant: Types.ObjectId,
    @Headers('Participant-Token') token: string,
    @Body() dto: UpdateParticipantDto,
  ): Promise<ReadParticipantDto | null> {
    return this.pollService.editParticipation(poll, participant, token, dto);
  }

  @Delete(':participant')
  @UseGuards(OptionalAuthGuard)
  async delete(
    @Param('poll', ObjectIdPipe) poll: Types.ObjectId,
    @Param('participant', ObjectIdPipe) participant: Types.ObjectId,
    @Headers('Participant-Token') token: string,
    @AuthUser() user?: UserToken,
  ): Promise<ReadParticipantDto | null> {
    const [participantDoc, pollDoc] = await Promise.all([
      this.pollService.findParticipant(participant),
      this.pollService.find(poll),
    ]);
    if (!participantDoc || !pollDoc) {
      throw new NotFoundException('Poll or participant not found');
    }
    if (participant.toString() !== token && !this.pollService.isAdmin(pollDoc, token, user?.sub)) {
      throw new ForbiddenException('You are not allowed to delete this participant');
    }
    return this.pollService.deleteParticipation(poll, participant);
  }
}
