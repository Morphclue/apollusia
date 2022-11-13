import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendMail(email: string, appointments: string[]) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Appointments booked',
            template: 'email',
            context: {
                appointments: appointments,
            },
        });
    }
}
