import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PollEventState} from "@apollusia/types";

import {Poll} from '../../model';

@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss'],
})
export class CheckButtonComponent {
  @Input() poll?: Poll;
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
