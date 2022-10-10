import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {CustomDefinitionModalComponent} from '../modals';

const routes: Routes = [
  {path: 'create', component: CreateEditPollComponent},
  {path: ':id', component: CreateEditPollComponent},
  {
    path: ':id/date', component: ChooseDateComponent, children: [
      {path: 'custom-definition', component: CustomDefinitionModalComponent},
    ],
  },
  {path: ':id/participate', component: ChooseEventsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollRoutingModule {
}
