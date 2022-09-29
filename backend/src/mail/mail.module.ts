import {Module} from '@nestjs/common';

import {MailService} from './mail/mail.service';

@Module({
    imports: [
        // TODO: Add and configure mailer module
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
