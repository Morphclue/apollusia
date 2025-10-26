import {isPlatformBrowser} from '@angular/common';
import {
  EnvironmentInjector,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
  Provider,
  runInInjectionContext,
} from '@angular/core';
import {
  createKeycloakSignal,
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakFeature,
} from 'keycloak-angular';
import Keycloak, {KeycloakConfig, KeycloakInitOptions} from 'keycloak-js';

export type ProvideKeycloakOptions = {
  config: KeycloakConfig;
  initOptions?: KeycloakInitOptions;
  providers?: Array<Provider | EnvironmentProviders>;
  features?: Array<KeycloakFeature>;
};

const provideKeycloakInAppInitializer = (
  keycloak: Keycloak,
  options: ProvideKeycloakOptions
): EnvironmentProviders | Provider[] => {
  const {initOptions, features = []} = options;

  if (!initOptions) {
    return [];
  }

  return provideAppInitializer(async () => {
    const platform = inject(PLATFORM_ID);

    if (isPlatformBrowser(platform)) {
      const injector = inject(EnvironmentInjector);
      runInInjectionContext(injector, () =>
        features.forEach((feature) => feature.configure())
      );

      await keycloak
        .init(initOptions)
        .catch((error) =>
          console.error('Keycloak initialization failed', error)
        );
    } else {
      console.log('Keycloak initialization skipped on server side');
    }
  });
};

export function provideKeycloakSSR(
  options: ProvideKeycloakOptions
): EnvironmentProviders {
  const keycloak = new Keycloak(options.config);

  const providers = options.providers ?? [];
  const keycloakSignal = createKeycloakSignal(keycloak);

  return makeEnvironmentProviders([
    {
      provide: KEYCLOAK_EVENT_SIGNAL,
      useValue: keycloakSignal,
    },
    {
      provide: Keycloak,
      useValue: keycloak,
    },
    ...providers,
    provideKeycloakInAppInitializer(keycloak, options),
  ]);
}
