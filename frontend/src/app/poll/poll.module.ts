import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';

import {CreatePollComponent} from './create-poll/create-poll.component';
import {PollRoutingModule} from './poll-routing.module';
import {EditPollComponent} from './edit-poll/edit-poll.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseDateService} from './services/choose-date.service';
import {SettingsComponent} from './settings/settings.component';


@NgModule({
  declarations: [
    CreatePollComponent,
    EditPollComponent,
    ChooseDateComponent,
    SettingsComponent,
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
  ],
})
export class PollModule {
}
