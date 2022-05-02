import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        CoreModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
