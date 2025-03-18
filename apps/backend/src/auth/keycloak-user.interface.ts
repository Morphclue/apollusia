import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export type KeycloakUser = UserRepresentation & {
  attributes?: Record<string, any> & {
    notifications?: string[];
    pushTokens?: string[];
  };
};
