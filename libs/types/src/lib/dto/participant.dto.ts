import {OmitType, PickType} from '@nestjs/swagger';

import {Participant} from '../schema';

export class CreateParticipantDto extends OmitType(Participant, ['_id', 'poll'] as const) {
}

export class UpdateParticipantDto extends PickType(Participant, ['selection'] as const) {
}

export const readParticipantExcluded = ['token', 'mail'] as const;
export const readParticipantSelect = readParticipantExcluded.map(s => `-${s}`);

export class ReadParticipantDto extends OmitType(Participant, readParticipantExcluded) {
}
