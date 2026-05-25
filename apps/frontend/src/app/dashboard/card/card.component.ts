import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';

import {InfoTableComponent} from '../../core/info-table/info-table.component';
import {ReadPoll} from '../../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [RouterLink, InfoTableComponent],
})
export class CardComponent {
  readonly poll = input.required<ReadPoll>();
  readonly small = input(false);
  readonly admin = input(false);
}
