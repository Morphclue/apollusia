import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LegalComponent} from './legal/legal.component';
import {LegalRoutingModule} from './legal-routing.module';

@NgModule({
  declarations: [LegalComponent],
  imports: [CommonModule, LegalRoutingModule],
})
export class LegalModule {
}
