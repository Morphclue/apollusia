import * as types from '@apollusia/types';

export type Participant = types.DTO<types.Participant>;

export type CreateParticipantDto = Omit<Participant, '_id' | 'poll'>;
