import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';

import {getMailerOptions} from './helpers';
import {MailService} from './mail/mail.service';



@Module({
  imports: [MailerModule.forRoot(getMailerOptions())],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
