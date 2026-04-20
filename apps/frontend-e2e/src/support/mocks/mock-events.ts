import {ReadPollEventDto} from '@apollusia/types';
import {Types} from 'mongoose';

export const mockEvents: ReadPollEventDto[] = [
  {
    _id: new Types.ObjectId('6844785ed2866d622a3a2ea4'),
    poll: new Types.ObjectId('684467b0eb92799b3c597357'),
    start: new Date('3025-06-08T20:30:00.000Z'),
    end: new Date('3025-06-08T20:45:00.000Z'),
    participants: 0,
  },
  {
    _id: new Types.ObjectId('6844785ed2866d622a3a2ea3'),
    poll: new Types.ObjectId('684467b0eb92799b3c597357'),
    start: new Date('3025-06-08T23:30:00.000Z'),
    end: new Date('3025-06-08T23:45:00.000Z'),
    participants: 0,
  },
];
