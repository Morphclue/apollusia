import {AuthModuleOptions} from '@mean-stream/nestx/auth';

export const environment = {
  port: +process.env.PORT || 3000,
  origin: process.env.ORIGIN || 'http://localhost:4200',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nest',
  },
  assetPath: __dirname + '/assets/',
  polls: {
    activeDays: +process.env.ACTIVE_DAYS || 7, // how many days a poll is active after the deadline is reached
  },
  keycloak: {
    baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080/auth',
    realmName: process.env.KEYCLOAK_REALM || 'apollusia',
    adminUser: process.env.KEYCLOAK_ADMIN_USER || 'admin',
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || 'root',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  auth: {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${
      // see http://localhost:8080/auth/admin/master/console/#/apollusia/realm-settings/keys/list -> RS256 -> Public Key
      process.env.AUTH_PUBLIC_KEY || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6RcQMrMgYacLZV2S6HXuPfbo6dF4y8ZjqrkMEM+Nj2Jt96BC4Ss9O9EkhQonXy2FWcUxvmEKicRApAMXto7r6TiE/LCi+pLfMnAxcIsiQIqDZrVWn5y1jz8gdKuvPxsTW1q3XEjqWuYUZof3/jahBrr1BBtNYRMonOC50a7d8wg7IBxwC3kk9zh8MImfJw6BZmSQ8fNuoHCORsUht7HW1h+HtbFEQEcTVUPxXUvV7Mw6Bgm7oWJLA3gG3heuOyUapqKnGkkMaJrA2xGrW9/66I65UD8jZgoEv5n2uGwXsmAafxZfoA+Mx/xCY6zEhpbxedtp99M2k0pvitwZmXCsnwIDAQAB'
    }\n-----END PUBLIC KEY-----`,
    verifyOptions: {
      algorithms: (process.env.AUTH_ALGORITHMS || 'RS256').split(',') as any[],
      issuer: process.env.AUTH_ISSUER || 'http://localhost:8080/auth/realms/apollusia',
    },
  } satisfies AuthModuleOptions,
};
