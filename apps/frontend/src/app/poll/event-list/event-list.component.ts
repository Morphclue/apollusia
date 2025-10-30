import {DatePipe} from '@angular/common';
import {Component, input} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {Participant, ReadPoll, ReadPollEvent} from '../../model';
import {ParticipantInfoComponent} from '../participant-info/participant-info.component';

@Component({
  selector: 'apollusia-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  imports: [
    NgbTooltip,
    ParticipantInfoComponent,
    DatePipe,
  ],
})
export class EventListComponent {
  readonly poll = input.required<ReadPoll>();
  readonly pollEvents = input.required<ReadPollEvent[]>();
  readonly participants = input.required<Participant[]>();
  readonly bestOption = input.required<number>();
}
