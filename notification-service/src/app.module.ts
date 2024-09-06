import { Module } from '@nestjs/common';
import { MailModule } from './mailer/mail.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),  
        MailModule, NotificationModule
    ],
})
export class AppModule {}
