import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './settings.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
