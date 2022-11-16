import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {CoreModule} from '../core/core.module';
import {TruncatePipe} from '../pipes';
import {CardComponent} from './card/card.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbTooltipModule,
    FormsModule,
    CoreModule,
  ],
})
export class DashboardModule {
}
