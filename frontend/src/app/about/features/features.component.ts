import {Component} from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  apps = ['Doodle', 'Apollusia'];
  features: [string, (boolean | string)[]][] = [
    ['Anonymous participation', [true, true]],
    ['Participation limit', [true, true]],
    ['Editing participation', [true, true]],
    ['Deadline', ['Paid option', true]],
    ['Maybe-option', ['Not adjustable', true]],
    ['Rich Text and Links in Description', [false, true]],
    ['Events of varying length', [false, true]],
    ['Blind participation', [false, true]],
    ['Autofill', [false, true]],
    ['Event Notes', [false, true]],
    ['Cloning polls', [false, true]],
    ['Postponing events', [false, true]],
  ];
}
