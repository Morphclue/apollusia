import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {inject, NgModule, provideAppInitializer} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {ModalModule, ToastModule} from '@mean-stream/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';

import {environment} from '../environments/environment';
import {AboutModule} from './about/about.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {BASE_URL} from './core/injection-tokens/base-url';
import {ParticipantTokenInterceptor} from './core/interceptors/participant-token.interceptor';
import {TokenService} from './core/services';
import {LegalModule} from './legal/legal.module';

function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    if (!globalThis.window) {
      return true;
    }
    return keycloak.init({
      config: environment.keycloak,
      initOptions: {
        onLoad: 'check-sso',
        messageReceiveTimeout: 1000,
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    }).catch(console.error);
  };
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
    AboutModule,
    LegalModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true, // always enabled, for push notifications
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
    {
      provide: BASE_URL,
      useFactory: () => window.location.origin + '/',
    },
    provideAppInitializer(() => {
      const initializerFn = (initializeKeycloak)(inject(KeycloakService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {
}
