import {DatePipe} from '@angular/common';
import {Component, input} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {PollEvent} from '../../model';

@Component({
  selector: 'app-event-head',
  templateUrl: './event-head.component.html',
  styleUrls: ['./event-head.component.scss'],
  imports: [NgbTooltip, DatePipe],
})
export class EventHeadComponent {
  readonly event = input.required<PollEvent>();
}
