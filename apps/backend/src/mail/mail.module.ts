import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';

import {environment} from '../environment';
import {MailService} from './mail/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: environment.mail.transport,
      defaults: environment.mail.defaults,
      template: {
        dir: environment.assetPath + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
}
