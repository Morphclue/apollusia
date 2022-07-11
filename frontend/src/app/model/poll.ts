import {CalendarEvent} from 'angular-calendar';

import {Settings} from './settings';

export interface Poll {
  title: string;
  description?: string;
  settings: Settings;
  events?: CalendarEvent[]
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>
