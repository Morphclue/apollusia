import {Settings} from './settings';
import {PollEvent} from './poll-event';

export interface Poll {
  title: string;
  description?: string;
  location?: string;
  adminToken: string;
  settings: Settings;
  events?: PollEvent[];
  bookedEvents?: string[];
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>
