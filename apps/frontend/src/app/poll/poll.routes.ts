import {Routes} from '@angular/router';

import {AutofillModalComponent, PostponeModalComponent} from '../modals';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {IcalComponent} from './ical/ical.component';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateEditPollComponent,
    title: 'Create Poll | Apollusia'
  },
  {
    path: ':id',
    component: CreateEditPollComponent,
    title: 'Edit Poll | Apollusia'
  },
  {
    path: ':id/date',
    component: ChooseDateComponent,
    title: 'Choose Dates | Apollusia',
    children: [
      {
        path: 'autofill',
        component: AutofillModalComponent,
        title: 'Autofill | Apollusia'
      },
      {
        path: 'postpone',
        component: PostponeModalComponent,
        title: 'Postpone | Apollusia'
      }
    ]
  },
  {
    path: ':id/participate',
    component: ChooseEventsComponent,
    title: 'Poll | Apollusia',
    children: [
      {path: 'ical', component: IcalComponent, title: 'Export iCal | Apollusia'}
    ]
  }
];
