import {Body, Controller, Get, Post} from '@nestjs/common';

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

    @Post('poll')
    async postPoll(@Body() pollDto: PollDto) {
        return this.appService.postPoll(pollDto);
    }
}
