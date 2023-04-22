export * from './token';

import * as types from '@apollusia/types';

export type Poll = types.DTO<types.Poll>;
export type CreatePollDto = types.DTOValue<types.PollDto>;
export type ReadPoll = types.DTO<types.ReadStatsPollDto>;

export type PollEvent = types.DTO<types.PollEvent> & { participants?: Participant[]; };
export type CreatePollEventDto = types.DTOValue<types.PollEventDto>;

export type Participant = types.DTO<types.Participant>;
export type CreateParticipantDto = types.DTOValue<types.ParticipantDto>;

export type Statistics = types.DTOValue<types.StatisticsDto>;
