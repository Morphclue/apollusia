import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

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
  ],
})
export class PollModule {
}
