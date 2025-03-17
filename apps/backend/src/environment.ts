import {AuthModuleOptions} from '@mean-stream/nestx/auth';
import {MailerOptions} from '@nestjs-modules/mailer';
import {Logger} from '@nestjs/common';

export const environment = {
  port: +(process.env.PORT || 3000),
  origin: process.env.ORIGIN || 'http://localhost:4200',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nest',
  },
  assetPath: __dirname + '/assets/',
  polls: {
    activeDays: +(process.env.ACTIVE_DAYS || 7), // how many days a poll is active after the deadline is reached
  },
  keycloak: {
    baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080/auth',
    realmName: process.env.KEYCLOAK_REALM || 'apollusia',
    adminUser: process.env.KEYCLOAK_ADMIN_USER || 'admin@apollusia.com',
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || 'root',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
    // http://localhost:8080/auth/admin/master/console/#/apollusia/clients -> admin-cli -> Credentials -> Client Secret
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || (Logger.warn('KEYCLOAK_CLIENT_SECRET not set!'), ''),
  },
  auth: {
    // http://localhost:8080/auth/admin/master/console/#/apollusia/realm-settings/keys/list -> RS256 -> Public Key
    publicKey: `-----BEGIN PUBLIC KEY-----\n${process.env.AUTH_PUBLIC_KEY || Logger.warn('AUTH_PUBLIC_KEY not set!')}\n-----END PUBLIC KEY-----`,
    verifyOptions: {
      algorithms: (process.env.AUTH_ALGORITHMS || 'RS256').split(',') as any[],
      issuer: process.env.AUTH_ISSUER || 'http://localhost:8080/auth/realms/apollusia',
    },
  } satisfies AuthModuleOptions,
  contact: {
    operator: process.env.CONTACT_OPERATOR || 'Apollusia Admins',
    address: process.env.CONTACT_ADDRESS || 'https://github.com/Morphclue/Apollusia',
    mail: process.env.CONTACT_MAIL || 'info@apollusia.com',
  },
  push: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
  mail: {
    transport: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SSL,
      opportunisticTLS: process.env.EMAIL_STARTTLS,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    defaults: {
      from: {
        name: process.env.EMAIL_NAME || 'Apollusia',
        address: process.env.EMAIL_FROM || 'info@apollusia.com',
      },
    },
  } satisfies MailerOptions,
};
