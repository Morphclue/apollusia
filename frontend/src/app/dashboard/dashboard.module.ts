import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CardComponent} from './card/card.component';
import {TruncatePipe} from '../pipes/truncate.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
  ],
})
export class DashboardModule {
}
