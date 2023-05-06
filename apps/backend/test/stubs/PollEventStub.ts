import {PollEvent} from '@apollusia/types';
import {Types} from 'mongoose';


export const PollEventStub = (): PollEvent => {
  return {
    _id: new Types.ObjectId('4b1f9b9b9b9b9b9b9b9b9b9b'),
    poll: new Types.ObjectId('5f1f9b9b9b9b9b9b9b9b9b9b'),
    start: '2022-12-24T12:00:00.000Z',
    end: '2022-12-24T20:00:00.000Z',
    note: 'Test',
  };
};
