import {Settings} from './settings';

export interface Poll {
  title: string;
  description?: string;
  location?: string;
  timeZone?: string;
  adminMail?: string;
  adminPush?: PushSubscriptionJSON;
  settings: Settings;
  bookedEvents: string[];
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>;
