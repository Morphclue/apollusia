import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';

import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {PollRoutingModule} from './poll-routing.module';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseDateService} from './services/choose-date.service';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {SomePipe} from '../pipes';
import {TokenService} from '../dashboard/token/token.service';

@NgModule({
  declarations: [
    CreateEditPollComponent,
    ChooseDateComponent,
    ChooseEventsComponent,
    SomePipe,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
  ],
  providers: [
    ChooseDateService,
    TokenService,
  ],
})
export class PollModule {
}
