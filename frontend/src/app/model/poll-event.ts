import {Participant} from './participant';

export interface PollEvent {
  eventId?: string | number;
  start: Date;
  end?: Date;
  participants?: Participant[];
  _id?: string;
}
