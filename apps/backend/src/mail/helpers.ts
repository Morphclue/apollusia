import {MailerOptions} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/adapters/handlebars.adapter';

import {environment} from '../environment';

export function renderDate(
  date: string | Date,
  locale = 'sv-SE',
  timeZone?: string,
) {
  return new Date(date).toLocaleString(locale, {
    timeZone,
  });
}

export function getMailerOptions(): MailerOptions {
  const options: MailerOptions = {
    transport: environment.mail.transport,
    defaults: environment.mail.defaults,
  };

  if (environment.mail.transport.host) {
    options.template = {
      dir: `${environment.assetPath}/templates`,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    };
  }

  return options;
}
