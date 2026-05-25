import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule as NgbxFormsModule} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {SettingsComponent} from './settings/settings.component';
import {SettingsRoutingModule} from './settings-routing.module';
import {TokenComponent} from './token/token.component';
import {CoreModule} from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule,
    NgbxFormsModule,
    NgbTooltip,
    SettingsComponent,
    TokenComponent,
  ],
})
export class SettingsModule {
}
