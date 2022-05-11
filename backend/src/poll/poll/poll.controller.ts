import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';

import {Poll} from '../../schema/poll.schema';
import {PollDto} from '../../dto/poll.dto';
import {PollService} from './poll.service';

@Controller('poll')
export class PollController {
    constructor(private readonly pollService: PollService) {
    }

    @Get()
    getPolls(): Promise<Poll[]> {
        return this.pollService.getPolls();
    }

    @Get(':id')
    getPoll(@Param('id') id: string): Promise<Poll> {
        return this.pollService.getPoll(id);
    }

    @Post()
    postPoll(@Body() pollDto: PollDto): Promise<Poll> {
        return this.pollService.postPoll(pollDto);
    }

    @Put()
    putPoll(@Body() pollDto: PollDto): Promise<Poll> {
        return this.pollService.putPoll(pollDto);
    }

    @Delete()
    deletePoll(@Body() id: string): Promise<Poll> {
        return this.pollService.deletePoll(id);
    }
}
