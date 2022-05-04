import {Injectable} from '@nestjs/common';

import {v4 as uuidv4} from 'uuid';
import {PollDto} from "./dto/poll.dto";

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    postPoll(pollDto: PollDto) {
        // TODO: implement logic
        return {uuid: uuidv4()};
    }
}
