import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ng-bootstrap-ext';

import {AboutModule} from './about/about.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {TokenService} from './core/services';
import {SettingsModalComponent} from './modals';
import {ParticipantTokenInterceptor} from './core/interceptors/participant-token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SettingsModalComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    NgbModule,
    ModalModule,
    HttpClientModule,
    ReactiveFormsModule,
    AboutModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    TokenService,
    {provide: HTTP_INTERCEPTORS, useClass: ParticipantTokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
