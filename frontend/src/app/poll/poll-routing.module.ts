import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreatePollComponent} from "./create-poll/create-poll.component";

const routes: Routes = [
  {path: '', component: CreatePollComponent},
  {path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollRoutingModule {
}
