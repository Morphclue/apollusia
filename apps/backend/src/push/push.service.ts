import {PushConfigDto} from '@apollusia/types';
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as webpush from 'web-push';
import {PushSubscription} from 'web-push';

import {KeycloakUser} from '../auth/keycloak-user.interface';
import {environment} from '../environment';

@Injectable()
export class PushService {
  private logger = new Logger(PushService.name);

  config?: PushConfigDto;

  constructor(
    config: ConfigService,
  ) {
    const publicKey = config.get('VAPID_PUBLIC_KEY');
    const privateKey = config.get('VAPID_PRIVATE_KEY');
    const emailSender = config.get('EMAIL_FROM');
    if (publicKey && privateKey && emailSender) {
      webpush.setVapidDetails('mailto:' + emailSender, publicKey, privateKey);

      this.config = {
        vapidPublicKey: publicKey,
      };
    } else {
      this.logger.warn('VAPID keys not set. Push notifications will not work.');
    }
  }

  async send(kcUser: KeycloakUser, title: string, body: string, url: string) {
    const payload = {
      notification: {
        title,
        body,
        icon: `${environment.origin}/assets/logo.png`,
        data: {
          onActionClick: {
            'default': {operation: 'openWindow', url},
          },
        },
      },
    };
    for (const pushTokenStr of kcUser.attributes.pushTokens) {
      const {token} = JSON.parse(pushTokenStr) as { token: PushSubscription };
      webpush.sendNotification(token, JSON.stringify(payload)).catch(error => this.logger.error(error.message, error.stack));
    }
  }
}
