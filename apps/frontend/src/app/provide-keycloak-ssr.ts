import { isPlatformBrowser } from '@angular/common';
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
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

export type ProvideKeycloakOptions = {
  /**
   * Keycloak configuration, including the server URL, realm, and client ID.
   */
  config: KeycloakConfig;

  /**
   * Optional initialization options for the Keycloak instance.
   * If not provided, Keycloak will not initialize automatically.
   */
  initOptions?: KeycloakInitOptions;

  /**
   * Optional array of additional Angular providers or environment providers.
   */
  providers?: Array<Provider | EnvironmentProviders>;

  /**
   * Optional array of Keycloak features to extend the functionality of the Keycloak integration.
   */
  features?: Array<KeycloakFeature>;
};

const provideKeycloakInAppInitializer = (
  keycloak: Keycloak,
  options: ProvideKeycloakOptions
): EnvironmentProviders | Provider[] => {
  const { initOptions, features = [] } = options;

  if (!initOptions) {
    return [];
  }

  return provideAppInitializer(async () => {
    const platform = inject(PLATFORM_ID);

    // only init keycloak in the browser
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
