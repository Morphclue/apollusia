import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CountUpModule} from 'ngx-countup';

import {AboutComponent} from './about/about.component';
import {AboutRoutingModule} from './about-routing.module';
import {FeaturesComponent} from './features/features.component';
import {InformationComponent} from './information/information.component';
import {PromisesComponent} from './promises/promises.component';
import {StatisticsComponent} from './statistics/statistics.component';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    CountUpModule,
    NgbTooltipModule,
    AboutComponent,
    StatisticsComponent,
    FeaturesComponent,
    InformationComponent,
    PromisesComponent,
  ],
})
export class AboutModule {
}
