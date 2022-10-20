import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendMail(email: string, message: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Appointments booked',
            template: 'email',
            context: {
                message: message,
            },
        });
    }
}
