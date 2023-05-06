import {Poll} from '@apollusia/types';
import {Types} from 'mongoose';

export const PollStub = (): Poll => {
  return {
    _id: new Types.ObjectId('5f1f9b9b9b9b9b9b9b9b9b9b'),
    title: 'Test',
    settings: {
      allowMaybe: true,
      allowEdit: true,
      anonymous: true,
      blindParticipation: true,
    },
    adminToken: '619b3a00-2dc3-48f1-8b3d-50386a91a559',
    bookedEvents: [],
  };
};
