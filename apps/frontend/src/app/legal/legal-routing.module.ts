import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LegalComponent} from './legal/legal.component';

const routes: Routes = [
  {path: '', component: LegalComponent, title: 'Legal | Apollusia'},
  {path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {
}
