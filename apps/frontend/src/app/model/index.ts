export * from './token';

import type * as types from '@apollusia/types';
import {DTO} from '@mean-stream/nestx/ref';

export type Poll = DTO<types.Poll>;
export type CreatePoll = DTO<types.CreatePollDto>;
export type EditPoll = DTO<types.UpdatePollDto>;
export type ReadPoll = DTO<types.ReadStatsPollDto>;

export type PollEvent = DTO<types.PollEvent>;
export type CreatePollEventDto = DTO<types.PollEventDto>;
export type ReadPollEvent = DTO<types.ReadPollEventDto>;

export type Participant = DTO<types.Participant>;
export type CreateParticipantDto = DTO<types.CreateParticipantDto>;
export type UpdateParticipantDto = DTO<types.UpdateParticipantDto>;

export type PollLog = DTO<types.PollLog>;
export type CreatePollLogDto = DTO<types.CreatePollLogDto>;

export type Statistics = DTO<types.StatisticsDto>;
