import {PollEvent} from './poll-event';

export interface Participant {
  name: string;
  participation: PollEvent[];
  indeterminateParticipation: PollEvent[];
  token: string;
  mail?: string;
  _id: string;
}

export type CreateParticipantDto = Omit<Participant, '_id'>;
