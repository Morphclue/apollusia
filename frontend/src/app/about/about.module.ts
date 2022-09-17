import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CountUpModule} from 'ngx-countup';

import {AboutRoutingModule} from './about-routing.module';
import {AboutComponent} from './about/about.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {FeaturesComponent} from './features/features.component';

@NgModule({
  declarations: [AboutComponent, StatisticsComponent, FeaturesComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    CountUpModule,
  ],
})
export class AboutModule {
}
