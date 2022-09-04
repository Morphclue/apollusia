import {PollEvent} from './poll-event';

export interface Participant {
  name: string;
  participation: PollEvent[];
}
