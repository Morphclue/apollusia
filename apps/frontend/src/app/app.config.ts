import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {provideClientHydration, BrowserModule} from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withRouterConfig
} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {ModalModule, ToastModule} from '@mean-stream/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {provideKeycloak} from 'keycloak-angular';

import {routes} from './app.routes';
import {CoreModule} from './core/core.module';
import {BASE_URL} from './core/injection-tokens/base-url';
import {ParticipantTokenInterceptor} from './core/interceptors/participant-token.interceptor';
import {TokenService} from './core/services';
import {provideKeycloakSSR} from './provide-keycloak-ssr';
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      NgbModule,
      ModalModule,
      ReactiveFormsModule,
      CoreModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: true, // always enabled, for push notifications
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      ToastModule,
    ),
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ParticipantTokenInterceptor,
      multi: true,
    },
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    ...(typeof window !== 'undefined'
      ? [{
          provide: BASE_URL,
          useFactory: () => window.location.origin,
        }]
      : []),
    // provideKeycloak({
    //   config: environment.keycloak,
    //   initOptions: {
    //     onLoad: 'check-sso',
    //     messageReceiveTimeout: 1000,
    //     silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    //   },
    // }),
    provideKeycloakSSR({
      config: environment.keycloak,
      initOptions: {
        onLoad: 'check-sso',
        messageReceiveTimeout: 1000,
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    }),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withRouterConfig({paramsInheritanceStrategy: 'always'})
    ),
    provideClientHydration(),
  ]
};
