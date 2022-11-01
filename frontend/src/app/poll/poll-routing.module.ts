import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomDefinitionModalComponent, PostponeModalComponent} from '../modals';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {AutofillModalComponent, PostponeModalComponent} from '../modals';

const routes: Routes = [
  {path: 'create', component: CreateEditPollComponent, title: 'Create Poll'},
  {path: ':id', component: CreateEditPollComponent, title: 'Edit Poll'},
  {
    path: ':id/date', component: ChooseDateComponent, title: 'Choose Dates', children: [
      {path: 'autofill', component: AutofillModalComponent},
      {path: 'postpone', component: PostponeModalComponent},
    ],
  },
  {path: ':id/participate', component: ChooseEventsComponent, title: 'Poll'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollRoutingModule {
}
