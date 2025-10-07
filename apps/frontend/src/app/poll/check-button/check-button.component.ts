import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PollEventState} from '@apollusia/types';

import {ReadPoll} from '../../model/index.js';

@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss'],
  standalone: false,
})
export class CheckButtonComponent {
  @Input() poll?: ReadPoll;
  @Input() isFull = false;
  @Input() isPastEvent = false;
  @Input() check?: PollEventState;
  @Output() checkChange = new EventEmitter<PollEventState>();

  toggle(): void {
    this.check = this.nextState(this.check || 'no');
    this.checkChange.next(this.check);
  }

  private nextState(state: PollEventState): PollEventState {
    switch (state) {
      case 'maybe':
        return 'no';
      case 'no':
        return 'yes';
      case 'yes':
        if (this.poll?.settings.allowMaybe) {
          return 'maybe';
        }
        return 'no';
    }
  }
}
