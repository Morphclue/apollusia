import {Participant} from './participant';

export interface PollEvent {
  start: Date;
  end?: Date;
  note?: string;
  participants?: Participant[];
  _id: string;
}

export interface CreatePollEventDto extends Omit<PollEvent, '_id'> {
  _id?: string;
}
