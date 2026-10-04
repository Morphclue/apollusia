import {ChangeDetectionStrategy, Component, inject, LOCALE_ID} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import features from './features.json';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip],
})
export class FeaturesComponent {
  readonly locale = inject(LOCALE_ID) === 'de' ? 'de' : 'en';

  readonly apps = ['Apollusia', 'Doodle', 'DuD-Poll', 'Calendly'] as const;
  readonly features = features;
}
