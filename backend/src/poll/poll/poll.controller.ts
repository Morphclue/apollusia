import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put} from '@nestjs/common';

import {PollService} from './poll.service';
import {MailDto, ParticipantDto, PollDto, PollEventDto} from '../../dto';
import {Participant, Poll} from '../../schema';

@Controller('poll')
export class PollController {
    constructor(private readonly pollService: PollService) {
    }

    @Get('all/:token')
    async getPolls(@Param('token') token: string): Promise<Poll[]> {
        if (!token) {
            return [];
        }
        return this.pollService.getPolls(token);
    }

    @Get(':id')
    async getPoll(@Param('id') id: string): Promise<Poll> {
        return this.pollService.getPoll(id);
    }

    @Post()
    async postPoll(@Body() pollDto: PollDto): Promise<Poll> {
        return this.pollService.postPoll(pollDto);
    }

    @Post(':id/clone')
    async clonePoll(@Param('id') id: string): Promise<Poll> {
        const existingPoll = await this.pollService.getPoll(id);
        if (!existingPoll) {
            throw new NotFoundException(id);
        }

        return this.pollService.clonePoll(existingPoll);
    }

    @Put(':id')
    async putPoll(@Param('id') id: string, @Body() pollDto: PollDto): Promise<Poll> {
        return this.pollService.putPoll(id, pollDto);
    }

    @Delete(':id')
    async deletePoll(@Param('id') id: string): Promise<Poll | undefined> {
        const poll = await this.pollService.deletePoll(id);
        if (!poll) {
            throw new NotFoundException(id);
        }
        return poll;
    }

    @Post(':id/events')
    async postEvents(@Param('id') id: string, @Body() pollEvents: PollEventDto[]): Promise<Poll> {
        const existingPoll = await this.pollService.getPoll(id);
        if (!existingPoll) {
            throw new NotFoundException(id);
        }

        return this.pollService.postEvents(id, existingPoll, pollEvents);
    }

    @Get(':id/participate')
    async getParticipants(@Param('id') id: string): Promise<Participant[]> {
        return this.pollService.getParticipants(id);
    }

    @Post(':id/participate')
    async postParticipation(@Param('id') id: string, @Body() participant: ParticipantDto): Promise<Participant> {
        return this.pollService.postParticipation(id, participant);
    }

    @Put('mail/participate')
    async setMail(@Body() mailDto: MailDto): Promise<void> {
        return this.pollService.setMail(mailDto);
    }

    @Put(':id/participate/:participantId')
    async editParticipation(
        @Param('id') id: string,
        @Param('participantId') participantId: string,
        @Body() participant: ParticipantDto,
    ): Promise<Participant> {
        return this.pollService.editParticipation(id, participantId, participant);
    }

    @Delete(':id/participate/:participantId')
    async deleteParticipation(
        @Param('id') id: string,
        @Param('participantId') participantId: string,
    ): Promise<Participant | undefined> {
        return this.pollService.deleteParticipation(id, participantId);
    }

    @Post(':id/book')
    async bookEvents(@Param('id') id: string, @Body() events: string[]): Promise<Poll> {
        const existingPoll = await this.pollService.getPoll(id);
        if (!existingPoll) {
            throw new NotFoundException(id);
        }

        return this.pollService.bookEvents(id, existingPoll, events);
    }
}
