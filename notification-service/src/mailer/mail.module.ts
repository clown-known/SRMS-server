import { Module, forwardRef } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [ConfigModule, forwardRef(() => KafkaModule)],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
