import {Component, Input} from '@angular/core';

import {Participant, ReadPoll, ReadPollEvent} from "../../model";

@Component({
  selector: 'apollusia-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent {
  @Input() poll!: ReadPoll;
  @Input() pollEvents!: ReadPollEvent[];
  @Input() participants!: Participant[];
}
