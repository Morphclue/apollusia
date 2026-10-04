import {Component, ChangeDetectionStrategy, inject, LOCALE_ID} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import features from './features.json';

const apps = ['Apollusia', 'Doodle', 'DuD-Poll', 'Calendly'] as const;
type App = (typeof apps)[number];
type Locale = 'en' | 'de';
type LocalizedText = Record<Locale, string>;

interface Feature {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  support: Record<App, boolean | string | LocalizedText>;
}

const localized = (value: string | LocalizedText, locale: Locale): string =>
  typeof value === 'string' ? value : value[locale];

interface FeatureCategory {
  title: LocalizedText;
  features: Feature[];
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip],
})
export class FeaturesComponent {
  readonly apps = apps;
  private readonly locale: Locale = inject(LOCALE_ID) === 'de' ? 'de' : 'en';
  readonly features = (features as FeatureCategory[]).map(category => ({
    title: category.title[this.locale],
    features: category.features.map(feature => ({
      ...feature,
      title: feature.title[this.locale],
      description: feature.description[this.locale],
      support: Object.fromEntries(
        Object.entries(feature.support).map(([app, value]) => [app, typeof value === 'boolean' ? value : localized(value, this.locale)]),
      ) as Record<App, boolean | string>,
    })),
  }));
  readonly alwaysOption = $localize`:@@about-feature-always:Always`;
  readonly paidOption = $localize`:@@about-feature-paid:Paid option`;
}
