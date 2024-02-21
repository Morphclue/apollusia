import {PollDto} from "@apollusia/types";

export const PollStub = (): PollDto => {
  return {
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
