import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreatePollComponent} from './create-poll/create-poll.component';
import {EditPollComponent} from './edit-poll/edit-poll.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';

const routes: Routes = [
  {path: 'create', component: CreatePollComponent},
  {path: 'edit/:id', component: EditPollComponent},
  {path: 'edit/:id/date', component: ChooseDateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollRoutingModule {
}
