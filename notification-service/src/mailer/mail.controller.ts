import { Controller, Post, Body } from '@nestjs/common';
import { SendMailDTO } from './mail.interface';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('send')
    async sendMail(@Body() sendMailDto: SendMailDTO) {
        console.log('Received request to send mail with data:', sendMailDto);
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
