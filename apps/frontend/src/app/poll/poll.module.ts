import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule as NgbxFormsModule, ModalModule, ToastModule} from '@mean-stream/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FlatpickrModule} from 'angularx-flatpickr';

import {CheckButtonComponent} from './check-button/check-button.component';
import {ChooseDateComponent} from './choose-date/choose-date.component';
import {ChooseEventsComponent} from './choose-events/choose-events.component';
import {CreateEditPollComponent} from './create-poll/create-edit-poll.component';
import {EventHeadComponent} from './event-head/event-head.component';
import {EventListComponent} from './event-list/event-list.component';
import {IcalComponent} from './ical/ical.component';
import {ParticipantInfoComponent} from './participant-info/participant-info.component';
import {PollLogComponent} from './poll-log/poll-log.component';
import {PollRoutingModule} from './poll-routing.module';
import {ChooseDateService} from './services/choose-date.service';
import {TableComponent} from './table/table.component';
import {CoreModule} from '../core/core.module';
import {AutofillModalComponent, PostponeModalComponent} from '../modals';
import {SomePipe} from '../pipes';

@NgModule({
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ModalModule,
    ToastModule,
    CoreModule,
    FlatpickrModule.forRoot(),
    NgbxFormsModule,
    PollLogComponent,
    CreateEditPollComponent,
    ChooseDateComponent,
    ChooseEventsComponent,
    AutofillModalComponent,
    PostponeModalComponent,
    SomePipe,
    EventHeadComponent,
    CheckButtonComponent,
    TableComponent,
    EventListComponent,
    ParticipantInfoComponent,
    IcalComponent,
  ],
  providers: [ChooseDateService],
})
export class PollModule {
}
