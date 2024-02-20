import {PollEventDto} from '@apollusia/types';

export const PollEventStub = (): PollEventDto => {
  return {
    start: new Date('2022-12-24T12:00:00.000Z'),
    end: new Date('2022-12-24T20:00:00.000Z'),
    note: 'Test',
  };
};
