import {DatePipe} from '@angular/common';
import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
    FormsModule,
  ],
})
export class EventListComponent {
  @Input() poll!: ReadPoll;
  @Input() pollEvents!: ReadPollEvent[];
  @Input() participants!: Participant[];
  @Input() bestOption!: number;

  protected showNoVotes = false;
}
