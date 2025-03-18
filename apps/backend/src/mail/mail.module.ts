import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';

import {environment} from '../environment';
import {MailService} from './mail/mail.service';

@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            transport: {
                host: config.get('EMAIL_HOST', 'localhost'),
                port: +config.get('EMAIL_PORT', 1025), // maildev
                secure: config.get('EMAIL_SSL', false),
                opportunisticTLS: config.get('EMAIL_STARTTLS', false),
                auth: {
                    user: config.get('EMAIL_USER'),
                    pass: config.get('EMAIL_PASSWORD'),
                },
            },
            defaults: {
                from: {
                    name: config.get('EMAIL_NAME', 'Apollusia'),
                    address: config.get('EMAIL_FROM', 'info@apollusia.com'),
                },
            },
            template: {
                dir: environment.assetPath + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        inject: [ConfigService],
    }), ConfigModule.forRoot()],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
