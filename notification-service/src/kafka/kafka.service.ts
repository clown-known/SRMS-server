import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { MailService } from 'src/mailer/mail.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly emailService: MailService,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('auth.registration');
    await this.kafkaClient.connect();
  }

  async handleRegistrationMessage(message: any) {
    const { email, username } = message.value;

    await this.emailService.sendMail(email);
  }
}
