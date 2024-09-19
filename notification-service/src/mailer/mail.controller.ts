import { Controller, Post, Body } from '@nestjs/common';
import { SendMailDTO } from './mail.interface';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @EventPattern('auth.registration')
    async sendRegisterMail(@Payload() sendMailDto: SendMailDTO) {
        console.log('Received request to send mail:', sendMailDto);
        try {
            await this.mailService.sendMail(sendMailDto);
            console.log('Email sent successfully');
            return { message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    @EventPattern('auth.authcode')
    async sendAuthCodeMail(@Payload() sendMailDto: SendMailDTO) {
        console.log('Received request to send mail:', sendMailDto);
        try {
            await this.mailService.sendMail(sendMailDto);
            console.log('Email sent successfully');
            return { message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
