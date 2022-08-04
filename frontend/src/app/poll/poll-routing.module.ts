import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {EditPollComponent} from './edit-poll/edit-poll.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';

const routes: Routes = [
  {path: 'create', component: CreateEditPollComponent},
  {path: ':id', component: EditPollComponent},
  {path: ':id/date', component: ChooseDateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollRoutingModule {
}
