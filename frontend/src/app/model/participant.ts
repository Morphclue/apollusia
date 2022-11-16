export interface Participant {
  name: string;
  participation: string[];
  indeterminateParticipation: string[];
  token: string;
  mail?: string;
  _id: string;
}

export type CreateParticipantDto = Omit<Participant, '_id'>
