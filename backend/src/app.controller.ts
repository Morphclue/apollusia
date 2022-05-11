import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {AppService} from './app.service';
import {PollDto} from "./dto/poll.dto";
import {Poll} from './schema/poll.schema';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('poll')
    getPolls(): Promise<Poll[]> {
        return this.appService.getPolls();
    }

    @Get('poll/:id')
    getPoll(@Param('id') id: string): Promise<Poll> {
        return this.appService.getPoll(id);
    }

    @Post('poll')
    postPoll(@Body() pollDto: PollDto): Promise<Poll> {
        return this.appService.postPoll(pollDto);
    }
}
