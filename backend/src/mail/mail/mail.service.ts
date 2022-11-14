import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
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
        Handlebars.registerHelper('date', function (date) {
            return new Date(date).toLocaleString();
        });

        let styles: Handlebars.SafeString;
        fs.promises.readFile(__dirname + '/../templates/styles.css', 'utf8').then(data => {
            styles = new Handlebars.SafeString(`<style>${data}</style>`);
        });
        Handlebars.registerHelper('style', () => styles);
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
