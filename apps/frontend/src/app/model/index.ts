export * from './token';

import * as types from '@apollusia/types';
import {DTO} from '@mean-stream/nestx/ref';

export type Poll = DTO<types.Poll>;
export type CreatePollDto = DTO<types.PollDto>;
export type ReadPoll = DTO<types.ReadStatsPollDto>;

export type PollEvent = DTO<types.PollEvent>;
export type CreatePollEventDto = DTO<types.PollEventDto>;

export type Participant = DTO<types.Participant>;
export type CreateParticipantDto = DTO<types.CreateParticipantDto>;
export type UpdateParticipantDto = DTO<types.UpdateParticipantDto>;

export type Statistics = DTO<types.StatisticsDto>;
