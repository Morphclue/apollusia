import {CreateParticipantDto} from '@apollusia/types';

export const ParticipantStub = (): CreateParticipantDto => {
  return {
    name: 'Administrator',
    selection: {},
    token: '619b3a00-2dc3-48f1-8b3d-50386a91a559',
  };
};
