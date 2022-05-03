import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";

import {CreatePollComponent} from './create-poll/create-poll.component';
import {PollRoutingModule} from "./poll-routing.module";


@NgModule({
  declarations: [
    CreatePollComponent,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
})
export class PollModule {
}
