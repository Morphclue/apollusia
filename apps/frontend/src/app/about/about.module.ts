import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CountUpModule} from 'ngx-countup';

import {AboutComponent} from './about/about.component';
import {AboutRoutingModule} from './about-routing.module';
import {FeaturesComponent} from './features/features.component';
import {StatisticsComponent} from './statistics/statistics.component';

@NgModule({
  declarations: [AboutComponent, StatisticsComponent, FeaturesComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    CountUpModule,
    NgbTooltipModule,
  ],
})
export class AboutModule {
}
