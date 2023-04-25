import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as webpush from 'web-push';
import {PushSubscription} from 'web-push';

@Injectable()
export class PushService {
    constructor(
        private config: ConfigService,
    ) {
        webpush.setVapidDetails('mailto:' + config.get('EMAIL_FROM'), config.get('VAPID_PUBLIC_KEY'), config.get('VAPID_PRIVATE_KEY'));
    }

    async send(sub: PushSubscription, title: string, body: string, url: string) {
        const payload = {
            notification: {
                title,
                body,
                // icon: 'assets/main-page-logo-small-hat.png',
                data: {
                    onActionClick: {
                        'default': {operation: 'openWindow', url},
                    },
                },
            },
        };
        await webpush.sendNotification(sub, JSON.stringify(payload));
    }
}
