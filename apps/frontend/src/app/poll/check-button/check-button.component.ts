import {Component, input, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PollEventState} from '@apollusia/types';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {ReadPoll} from '../../model/index.js';

@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss'],
  imports: [NgbTooltip, FormsModule],
})
export class CheckButtonComponent {
  readonly poll = input<ReadPoll>();
  readonly isFull = input(false);
  readonly isPastEvent = input(false);
  readonly check = model<PollEventState>();

  toggle(): void {
    this.check.set(this.nextState(this.check() || 'no'));
  }

  private nextState(state: PollEventState): PollEventState {
    switch (state) {
      case 'maybe':
        return 'no';
      case 'no':
        return 'yes';
      case 'yes':
        if (this.poll()?.settings.allowMaybe) {
          return 'maybe';
        }
        return 'no';
    }
  }
}
