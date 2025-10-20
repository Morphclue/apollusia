import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import {Participant} from '../../model';

@Component({
  selector: 'apollusia-participant-info',
  templateUrl: './participant-info.component.html',
  styleUrl: './participant-info.component.scss',
  imports: [NgbTooltip, DatePipe],
})
export class ParticipantInfoComponent {
  @Input({required: true}) participant: Participant;
}
