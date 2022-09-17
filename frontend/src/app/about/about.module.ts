import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CountUpModule} from 'ngx-countup';

import {AboutRoutingModule} from './about-routing.module';
import {AboutComponent} from './about/about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    CountUpModule,
  ],
})
export class AboutModule {
}
