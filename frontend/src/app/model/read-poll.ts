import {Poll} from './poll';

export interface ReadPoll extends Poll {
  events: number;
  participants: number;
}
