import {Poll} from '@apollusia/types';
import {Types} from 'mongoose';

export const PollStub = (): Poll => {
  const _id = new Types.ObjectId('5f1f9b9b9b9b9b9b9b9b9b9b');
  return {
    _id,
    id: _id.toString('base64'),
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
