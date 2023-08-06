import {Component} from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  apps = ['Apollusia', 'Doodle'];
  features: [string, (boolean | string)[]][] = [
    ['Anonymous participation', [true, true]],
    ['Participation limit', [true, true]],
    ['Editing participation', [true, true]],
    ['Deadline', [true, 'Paid option']],
    ['Maybe-option', [true, 'Not adjustable']],
    ['Rich Text and Links in Description', [true, false]],
    ['Events of varying length', [true, false]],
    ['Blind participation', [true, false]],
    ['Autofill', [true, false]],
    ['Event Notes', [true, false]],
    ['Cloning polls', [true, false]],
    ['Postponing events', [true, false]],
  ];
}
