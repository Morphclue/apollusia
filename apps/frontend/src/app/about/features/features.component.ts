import {Component} from '@angular/core';

import features from './features.json';

const apps = ['Apollusia', 'Doodle', 'DuD-Poll', 'Calendly'] as const;
type App = typeof apps[number];

interface Feature {
  icon?: string;
  title: string;
  description: string;
  apollusiaIssue?: number;
  support: Record<App, boolean | 'Always' | 'Paid option' | string>;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  readonly apps = apps;
  readonly features: Record<string, Feature[]> = features;
}
