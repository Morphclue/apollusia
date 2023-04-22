export * from './token';
export * from './statistics';

import * as types from '@apollusia/types';

export type Poll = types.DTO<types.Poll>;
export type CreatePollDto = Omit<Poll, '_id'>;

export interface ReadPoll extends Poll {
  isAdmin: boolean;
  events: number;
  participants: number;
}

export type PollEvent = types.DTO<types.PollEvent> & { participants?: Participant[]; };
export type CreatePollEventDto = Omit<PollEvent, '_id' | 'poll'> & { _id?: string; };

export type Participant = types.DTO<types.Participant>;
export type CreateParticipantDto = Omit<Participant, '_id' | 'poll'>;
