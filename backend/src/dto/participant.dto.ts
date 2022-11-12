import {OmitType} from '@nestjs/swagger';
import {Participant} from '../schema';

export class ParticipantDto extends OmitType(Participant, ['_id', 'poll'] as const) {
}
