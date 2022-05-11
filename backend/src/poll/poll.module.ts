import {Module} from '@nestjs/common';

import {PollService} from './poll/poll.service';
import {PollController} from './poll/poll.controller';

@Module({
    providers: [PollService],
    controllers: [PollController],
})
export class PollModule {
}
