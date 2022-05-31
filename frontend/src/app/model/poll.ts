import {CalendarEvent} from 'angular-calendar';

export interface Poll {
  title: string;
  description?: string;
  deadline?: string;
  events?: CalendarEvent[]
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>
