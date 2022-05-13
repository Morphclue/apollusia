export interface Poll {
  title: string;
  description?: string;
  deadline?: string;
  _id: string;
}

export type CreatePollDto = Omit<Poll, '_id'>
