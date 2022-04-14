import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreatePollComponent} from './create-poll/create-poll.component';
import {PollRoutingModule} from "./poll-routing.module";


@NgModule({
  declarations: [
    CreatePollComponent,
  ],
  imports: [
    CommonModule,
    PollRoutingModule,
  ],
})
export class PollModule {
}
