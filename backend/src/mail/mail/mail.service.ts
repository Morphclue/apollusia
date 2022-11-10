import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {Participant, Poll} from '../../schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendMail(poll: Poll, participant: Participant, appointments: string[]) {
        await this.mailerService.sendMail({
            to: {
                name: participant.name,
                address: participant.mail,
            },
            subject: `${poll.title} - Appointments booked`,
            template: 'email',
            context: {
                poll,
                participant,
                appointments,
            },
        });
    }
}
