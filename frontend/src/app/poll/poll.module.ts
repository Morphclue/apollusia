import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';
import {ModalModule, ToastModule} from 'ng-bootstrap-ext';

import {PollRoutingModule} from './poll-routing.module';
import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {EventHeadComponent} from './event-head/event-head.component';
import {CheckButtonComponent} from './check-button/check-button.component';
import {AutofillModalComponent, PostponeModalComponent} from '../modals';
import {ChooseDateService} from './services/choose-date.service';
import {SomePipe} from '../pipes';

@NgModule({
  declarations: [
    CreateEditPollComponent,
    ChooseDateComponent,
    ChooseEventsComponent,
    AutofillModalComponent,
    PostponeModalComponent,
    SomePipe,
    EventHeadComponent,
    CheckButtonComponent,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ModalModule,
    ToastModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
  ],
  providers: [
    ChooseDateService,
  ],
})
export class PollModule {
}
