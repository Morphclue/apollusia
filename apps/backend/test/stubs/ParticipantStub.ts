import {Participant} from '@apollusia/types';
import {Types} from 'mongoose';

export const ParticipantStub = (): Participant => {
  return {
    _id: new Types.ObjectId('6385f9a2af23127d1e023759'),
    poll: new Types.ObjectId('5f1f9b9b9b9b9b9b9b9b9b9b'),
    name: 'Administrator',
    participation: [],
    indeterminateParticipation: [],
    token: '619b3a00-2dc3-48f1-8b3d-50386a91a559',
  };
};
