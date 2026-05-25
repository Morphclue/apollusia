import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LegalComponent} from './legal/legal.component';
import {LegalRoutingModule} from './legal-routing.module';
import {ImprintService} from './services/imprint.service';

@NgModule({
  imports: [
    CommonModule,
    LegalRoutingModule,
    LegalComponent,
  ],
  providers: [
    ImprintService,
  ],
})
export class LegalModule {
}
