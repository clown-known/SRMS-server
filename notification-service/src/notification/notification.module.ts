import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailModule } from 'src/mailer/mail.module';

@Module({
  imports: [MailModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
