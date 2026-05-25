import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {CardComponent} from './card/card.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {SearchPipe} from './pipes/search.pipe';
import {CoreModule} from '../core/core.module';
import {TruncatePipe} from '../pipes';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbTooltipModule,
    FormsModule,
    CoreModule,
    NgbNavModule,
    NgOptimizedImage,
    DashboardComponent,
    CardComponent,
    TruncatePipe,
    SearchPipe,
  ],
})
export class DashboardModule {
}
