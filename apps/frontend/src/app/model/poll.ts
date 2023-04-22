import * as types from '@apollusia/types';

export type Poll = types.DTO<types.Poll>;

export type CreatePollDto = Omit<Poll, '_id'>;
