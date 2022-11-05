import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Poll} from '../../model';
import {CheckboxState} from '../../model/checkbox-state';

@Component({
  selector: 'app-check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss'],
})
export class CheckButtonComponent {
  @Input() poll?: Poll;
  @Input() isFull = false;
  @Input() check!: CheckboxState;
  @Output() checkChanged = new EventEmitter<CheckboxState>();

  toggle(): void {
    this.checkChanged.next(this.check = this.nextState(this.check));
  }

  private nextState(state: CheckboxState): CheckboxState {
    switch (state) {
      case CheckboxState.INDETERMINATE:
        return CheckboxState.FALSE;
      case CheckboxState.FALSE:
        return CheckboxState.TRUE;
      case CheckboxState.TRUE:
        if (this.poll?.settings.allowMaybe) {
          return CheckboxState.INDETERMINATE;
        }
        return CheckboxState.FALSE;
    }
  }
}
