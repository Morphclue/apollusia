import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as MarkdownIt from 'markdown-it';
import {environment} from '../../environment';

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

    async sendMail(name: string, address: string, subject: string, template: string, context?: any) {
        await this.mailerService.sendMail({
            to: {
                name,
                address,
            },
            subject,
            template,
            context: {
                ...context,
                origin: environment.origin,
            },
        });
    }
}
