import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CoreModule} from '../core/core.module';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CardComponent} from './card/card.component';
import {TruncatePipe} from '../pipes';

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
