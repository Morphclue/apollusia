import {Component, Input} from '@angular/core';

import {ReadPoll} from '../../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardComponent {
  @Input() poll!: ReadPoll;
  @Input() small = false;
  @Input() admin = false;
}
