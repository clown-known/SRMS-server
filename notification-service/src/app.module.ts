import { Module } from '@nestjs/common';
import { MailModule } from './mailer/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),  
        MailModule
    ],
})
export class AppModule {}
