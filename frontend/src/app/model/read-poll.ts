import {Poll} from './poll';

export interface ReadPoll extends Poll {
  isAdmin: boolean;
  events: number;
  participants: number;
}
