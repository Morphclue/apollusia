import {KeyValuePipe} from '@angular/common';
import {Component, ChangeDetectionStrategy, inject, LOCALE_ID} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import featuresDe from './features.de.json';
import features from './features.json';

const apps = ['Apollusia', 'Doodle', 'DuD-Poll', 'Calendly'] as const;
type App = (typeof apps)[number];

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip, KeyValuePipe],
})
export class FeaturesComponent {
  readonly apps = apps;
  readonly features: Record<string, Feature[]> = inject(LOCALE_ID) === 'de' ? featuresDe : features;
  readonly alwaysOption = $localize`:@@about-feature-always:Always`;
  readonly paidOption = $localize`:@@about-feature-paid:Paid option`;
}
