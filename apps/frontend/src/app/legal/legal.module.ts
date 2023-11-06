import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LegalComponent} from './legal/legal.component';
import {LegalRoutingModule} from './legal-routing.module';
import {ImprintService} from './services/imprint.service';

@NgModule({
    declarations: [
        LegalComponent,
    ],
    imports: [
        CommonModule,
        LegalRoutingModule,
    ],
    providers: [
        ImprintService,
    ],
})
export class LegalModule {
}
