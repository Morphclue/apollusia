import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {CardComponent} from './card/card.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CoreModule} from '../core/core.module';
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
    NgbNavModule,
  ],
})
export class DashboardModule {
}
