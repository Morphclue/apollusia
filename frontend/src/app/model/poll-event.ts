import {Participant} from './participant';

export interface PollEvent {
  eventId?: string | number;
  start: Date;
  end?: Date;
  note?: string;
  participants?: Participant[];
  _id?: string;
}
