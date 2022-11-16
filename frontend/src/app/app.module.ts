import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ng-bootstrap-ext';

import {AboutModule} from './about/about.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {TokenService} from './core/services';
import {SettingsModalComponent} from './modals';

@NgModule({
  declarations: [
    AppComponent,
    SettingsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ModalModule,
    HttpClientModule,
    ReactiveFormsModule,
    AboutModule,
    CoreModule,
  ],
  providers: [TokenService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
