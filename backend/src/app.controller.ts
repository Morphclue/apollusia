import {Body, Controller, Get, Post} from '@nestjs/common';

import {AppService} from './app.service';
import {PollDto} from "./dto/PollDto";

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
        // TODO: implement logic
        console.log(pollDto);
        return 'this needs to be implemented';
    }
}
