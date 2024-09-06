import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mailer/mail.service';

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService) {}

  async sendNotification(to: string, subject: string, context: { name: string; code: string }): Promise<void> {
    await this.mailService.sendMail({
      to,
      subject,
      context,
    });
  }
}