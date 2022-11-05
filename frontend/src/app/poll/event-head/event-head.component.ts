import {Component, Input} from '@angular/core';

import {PollEvent} from '../../model';

@Component({
  selector: 'app-event-head',
  templateUrl: './event-head.component.html',
  styleUrls: ['./event-head.component.scss'],
})
export class EventHeadComponent {
  @Input() event!: PollEvent;
}
