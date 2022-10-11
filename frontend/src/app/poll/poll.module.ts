import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';
import {ModalModule} from 'ng-bootstrap-ext';

import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {PollRoutingModule} from './poll-routing.module';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseDateService} from './services/choose-date.service';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {SomePipe} from '../pipes';
import {CustomDefinitionModalComponent, PostponeModalComponent} from '../modals';

@NgModule({
  declarations: [
    CreateEditPollComponent,
    ChooseDateComponent,
    ChooseEventsComponent,
    CustomDefinitionModalComponent,
    PostponeModalComponent,
    SomePipe,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ModalModule,
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
