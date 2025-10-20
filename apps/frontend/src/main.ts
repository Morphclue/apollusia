/// <reference types="@angular/localize" />



import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, provideAppInitializer, inject, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ModalModule, ToastModule } from '@mean-stream/ngbx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

import { AboutModule } from './app/about/about.module';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';
import { BASE_URL } from './app/core/injection-tokens/base-url';
import { ParticipantTokenInterceptor } from './app/core/interceptors/participant-token.interceptor';
import { TokenService } from './app/core/services';
import { LegalModule } from './app/legal/legal.module';
import { environment } from './environments/environment';

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

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, NgbModule, ModalModule, ReactiveFormsModule, AboutModule, LegalModule, CoreModule, ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: true, // always enabled, for push notifications
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }), ToastModule, KeycloakAngularModule),
        TokenService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ParticipantTokenInterceptor,
            multi: true,
        },
        provideClientHydration(),
        provideHttpClient(withFetch()),
        ...(typeof window !== 'undefined'
            ? [{
                    provide: BASE_URL,
                    useFactory: () => window.location.origin,
                }]
            : []),
        provideAppInitializer(() => {
            const initializerFn = (initializeKeycloak)(inject(KeycloakService));
            return initializerFn();
        }),
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
    .catch(err => console.error(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
