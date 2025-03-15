import {Injectable} from '@nestjs/common';

import {environment} from '../environment';
import {KeycloakUser} from './keycloak-user.interface';

@Injectable()
export class KeycloakService {
  async getUser(id: string): Promise<KeycloakUser | undefined> {
    const KeycloakAdminClient = (await import('@keycloak/keycloak-admin-client')).default;
    const kcAdminClient = new KeycloakAdminClient({
      baseUrl: environment.keycloak.baseUrl,
      realmName: environment.keycloak.realmName,
    });
    try {
      await kcAdminClient.auth({
        grantType: 'password',
        username: environment.keycloak.adminUser,
        password: environment.keycloak.adminPassword,
        clientId: environment.keycloak.clientId,
        clientSecret: environment.keycloak.clientSecret,
      });
    } catch (err) {
      console.error(err);
      return;
    }
    return kcAdminClient.users.findOne({id});
  }
}
