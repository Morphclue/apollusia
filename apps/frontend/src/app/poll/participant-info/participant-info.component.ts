import {DatePipe} from '@angular/common';
import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {Participant} from '../../model';

@Component({
  selector: 'apollusia-participant-info',
  templateUrl: './participant-info.component.html',
  styleUrl: './participant-info.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip, DatePipe],
})
export class ParticipantInfoComponent {
  readonly participant = input.required<Participant>();
}
