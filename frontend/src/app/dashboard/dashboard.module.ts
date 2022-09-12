import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CardComponent} from './card/card.component';
import {TruncatePipe} from '../pipes';
import {TokenComponent} from './token/token.component';
import {TokenService} from './token/token.service';

@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    TruncatePipe,
    TokenComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    NgbTooltipModule,
    FormsModule,
  ],
  providers: [TokenService],
})
export class DashboardModule {
}
