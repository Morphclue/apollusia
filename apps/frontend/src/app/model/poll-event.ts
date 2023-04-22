import * as types from '@apollusia/types';

import {Participant} from './participant';

export type PollEvent = types.DTO<types.PollEvent> & {
  participants?: Participant[];
};

export interface CreatePollEventDto extends Omit<PollEvent, '_id' | 'poll'> {
  _id?: string;
}
