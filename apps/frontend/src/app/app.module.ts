import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import {APP_INITIALIZER, isDevMode, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {ModalModule, ToastModule} from '@mean-stream/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';

import {AboutModule} from './about/about.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {ParticipantTokenInterceptor} from './core/interceptors/participant-token.interceptor';
import {TokenService} from './core/services';
import {LegalModule} from './legal/legal.module';
import {environment} from '../environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: environment.keycloak,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ModalModule,
    HttpClientModule,
    ReactiveFormsModule,
    AboutModule,
    LegalModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ToastModule,
    KeycloakAngularModule,
  ],
  providers: [
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ParticipantTokenInterceptor,
      multi: true,
    },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ...globalThis.document ? [{
      provide: 'BASE_URL',
      useValue: globalThis.document?.baseURI,
    }] : [],
    {
      // https://github.com/mauriciovigolo/keycloak-angular#setup
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
