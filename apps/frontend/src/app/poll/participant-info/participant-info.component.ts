import {Component, Input} from '@angular/core';

import {Participant} from '../../model';

@Component({
  selector: 'apollusia-participant-info',
  templateUrl: './participant-info.component.html',
  styleUrl: './participant-info.component.scss',
  standalone: false,
})
export class ParticipantInfoComponent {
  @Input({required: true}) participant: Participant;
}
