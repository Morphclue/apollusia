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

    getPolls() {
        return [{title: 'dummy1'}, {title: 'dummy2'}];
    }

    getPoll(id: string) {
        return {title: 'dummy'};
    }
}
