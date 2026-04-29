import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
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
export class EventListComponent implements OnInit {
  @Input() poll!: ReadPoll;
  @Input() pollEvents!: ReadPollEvent[];
  @Input() participants!: Participant[];
  @Input() bestOption!: number;

  protected showNoVotes = false;
  eventsGroupedByDate: [Date, ReadPollEvent[]][] = [];

  ngOnInit() {
    const groupedEvents: Map<number, ReadPollEvent[]> = new Map();
    for (const event of this.pollEvents) {
      const eventDate = new Date(event.start).setHours(0, 0, 0, 0); // Normalize to the start of the day
      if (!groupedEvents.has(eventDate)) {
        groupedEvents.set(eventDate, []);
      }
      groupedEvents.get(eventDate)!.push(event);
    }
    this.eventsGroupedByDate = Array.from(groupedEvents.entries())
      .sort((a, b) => +a[0] - +b[0])
      .map(([dateMs, events]) => [new Date(dateMs), events])
    ;
  }
}
