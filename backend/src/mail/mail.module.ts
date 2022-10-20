import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {join} from 'path';

import {MailService} from './mail/mail.service';

@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            transport: {
                host: config.get('EMAIL_HOST'),
                secure: false,
                auth: {
                    user: config.get('EMAIL_USER'),
                    pass: config.get('EMAIL_PASSWORD'),
                },
            },
            defaults: {
                from: config.get('EMAIL_FROM'),
            },
            template: {
                dir: join(__dirname, './templates'),
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
