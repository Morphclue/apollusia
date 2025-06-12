import { ReadPollDto, ShowResultOptions } from '@apollusia/types';
import { Types } from 'mongoose';

export const mockPoll: ReadPollDto = {
  title: 'My Poll',
  description: 'This is short description',
  location: 'Discord',
  timeZone: 'Europe/Berlin',
  adminMail: false,
  adminPush: false,
  settings: {
    deadline: new Date('3333-10-15T04:20:00.000Z'),
    allowMaybe: true,
    allowEdit: true,
    anonymous: false,
    allowComments: true,
    logHistory: true,
    showResult: 'immediately' as ShowResultOptions,
  },
  bookedEvents: {},
  _id:  new Types.ObjectId('684467b0eb92799b3c597357'),
  createdAt: new Date('3025-06-07T16:00:00.238Z'),
  updatedAt: new Date('3025-06-07T16:00:00.238Z'),
  id: 'aERnsOuSeZs8WXNX'
}
