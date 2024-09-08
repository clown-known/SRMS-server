import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDTO } from './mail.interface';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = this.mailTransport();
    }

    private mailTransport(): nodemailer.Transporter {
        return nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('MAIL_USERNAME'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
    }

    private loadHtmlTemplate(templateName: string, context: Record<string, any>): string {
        const templatePath = path.resolve(`./src/mailer/templates/${templateName}.html`);
        let html = fs.readFileSync(templatePath, 'utf-8');
        
        for (const [key, value] of Object.entries(context)) {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, 'g'), value);
        }
        
        return html;
    }

    

    async sendMail(sendMailDto: SendMailDTO): Promise<void> {
        try { 

            const htmlContent = this.loadHtmlTemplate('', sendMailDto.context || {});

            const mailOptions: nodemailer.SendMailOptions = {
                from: this.configService.get<string>('MAIL_FROM'),
                to: sendMailDto.to,
                subject: sendMailDto.subject,
                html: htmlContent, 
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Mail sent successfully');
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;
        }
    }
}
