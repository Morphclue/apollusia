import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {SettingsComponent} from './settings/settings.component';
import {SettingsRoutingModule} from './settings-routing.module';
import {CoreModule} from '../core/core.module';
import {FormsModule} from "@mean-stream/ngbx";

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule
  ]
})
export class SettingsModule {
}
