import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch, withInterceptors,
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
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
} from 'keycloak-angular';

import {routes} from './app.routes';
import {CoreModule} from './core/core.module';
import {BASE_URL} from './core/injection-tokens/base-url';
import {ParticipantTokenInterceptor} from './core/interceptors/participant-token.interceptor';
import {TokenService} from './core/services';
import {provideKeycloakSSR} from './provide-keycloak-ssr';
import {environment} from '../environments/environment';

const isBrowser = typeof window !== 'undefined';
const silentCheckSsoRedirectUri = isBrowser
  ? window.location.origin + '/assets/silent-check-sso.html'
  : undefined;

const pollApiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /\/api\/v1\/poll(\/.*)?$/i
});

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
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([includeBearerTokenInterceptor])
    ),
    ...(isBrowser
      ? [{
          provide: BASE_URL,
          useFactory: () => window.location.origin,
        }]
      : []),
    provideKeycloakSSR({
      config: environment.keycloak,
      initOptions: isBrowser ? {
        onLoad: 'check-sso',
        messageReceiveTimeout: 1000,
        silentCheckSsoRedirectUri,
      } : undefined,
      providers: [
        {
          provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue: [pollApiCondition]
        }
      ]
    }),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withRouterConfig({paramsInheritanceStrategy: 'always'})
    ),
    provideClientHydration(),
  ]
};
