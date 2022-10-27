import {Settings} from './settings';

export interface Poll {
  title: string;
  description?: string;
  location?: string;
  adminToken: string;
  settings: Settings;
  bookedEvents?: string[];
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>
