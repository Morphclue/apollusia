import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {join} from 'path';

import {MailService} from './mail/mail.service';

@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            transport: {
                host: config.get('EMAIL_HOST'),
                port: config.get('EMAIL_PORT'),
                secure: config.get('EMAIL_SSL'),
                opportunisticTLS: config.get('EMAIL_STARTTLS'),
                auth: {
                    user: config.get('EMAIL_USER'),
                    pass: config.get('EMAIL_PASSWORD'),
                },
            },
            defaults: {
                from: {
                    name: config.get('EMAIL_NAME', 'Apollusia'),
                    address: config.get('EMAIL_FROM'),
                },
            },
            template: {
                dir: __dirname + '/assets/templates',
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
