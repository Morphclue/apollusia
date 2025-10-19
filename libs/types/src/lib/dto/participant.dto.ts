import {Type} from '@nestjs/common';
import {OmitType, PickType} from '@nestjs/swagger';

import {Participant} from '../schema';

export class CreateParticipantDto extends (OmitType(Participant, ['_id', 'poll'] as const) as Type<Omit<Participant, '_id' | 'poll'>>) {
}

export class UpdateParticipantDto extends (PickType(Participant, ['selection'] as const) as Type<Pick<Participant, 'selection'>>) {
}

export const readParticipantExcluded = ['token'] as const;
export const readParticipantSelect = readParticipantExcluded.map(s => `-${s}`);

export class ReadParticipantDto extends (OmitType(Participant, readParticipantExcluded) as Type<Omit<Participant, typeof readParticipantExcluded[number]>>) {
}
