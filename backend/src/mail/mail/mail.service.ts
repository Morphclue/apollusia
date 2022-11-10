import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import * as MarkdownIt from 'markdown-it';
import * as Handlebars from 'handlebars';
import {Participant, Poll} from '../../schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
        const markdown = new MarkdownIt({
            breaks: true,
            linkify: true,
        });
        Handlebars.registerHelper('markdown', function (context) {
            return new Handlebars.SafeString(markdown.render(context));
        });
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
