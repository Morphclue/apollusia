import {Poll} from '../schema';

export class ReadPollDto extends Poll {
    events: number;
    participants: number;
}

