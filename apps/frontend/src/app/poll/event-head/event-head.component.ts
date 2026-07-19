import {DatePipe} from '@angular/common';
import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {PollEvent} from '../../model';

@Component({
  selector: 'app-event-head',
  templateUrl: './event-head.component.html',
  styleUrls: ['./event-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip, DatePipe],
})
export class EventHeadComponent {
  readonly event = input.required<PollEvent>();
}
