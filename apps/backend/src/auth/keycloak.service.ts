import {default as KeycloakAdminClient} from '@keycloak/keycloak-admin-client';
import {Injectable} from '@nestjs/common';

import {KeycloakUser} from './keycloak-user.interface';
import {environment} from '../environment';

@Injectable()
export class KeycloakService {
  async getUser(id: string): Promise<KeycloakUser | undefined> {
    // TODO auth only once
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
