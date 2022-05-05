import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
  ],
})
export class DashboardModule {
}
