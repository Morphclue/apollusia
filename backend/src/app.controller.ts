import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {AppService} from './app.service';
import {PollDto} from "./dto/poll.dto";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('poll')
    getPolls(): PollDto[] {
        return this.appService.getPolls();
    }

    @Get('poll/:id')
    getPoll(@Param('id') id: string): PollDto {
        return this.appService.getPoll(id);
    }

    @Post('poll')
    postPoll(@Body() pollDto: PollDto) {
        return this.appService.postPoll(pollDto);
    }
}
