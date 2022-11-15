import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';
import {ModalModule, ToastModule} from 'ng-bootstrap-ext';

import {CoreModule} from '../core/core.module';
import {AutofillModalComponent, PostponeModalComponent} from '../modals';
import {SomePipe} from '../pipes';
import {CheckButtonComponent} from './check-button/check-button.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {EventHeadComponent} from './event-head/event-head.component';
import {MailAlertComponent} from './mail-alert/mail-alert.component';
import {PollRoutingModule} from './poll-routing.module';
import {ChooseDateService} from './services/choose-date.service';

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
    MailAlertComponent,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ModalModule,
    ToastModule,
    CoreModule,
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
