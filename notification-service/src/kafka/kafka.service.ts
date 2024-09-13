import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { MailService } from 'src/mailer/mail.service';
import { EmailTemplate, EmailTemplateSubject } from 'src/common/enum';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('auth.registration');
    await this.kafkaClient.connect();
  }

  @MessagePattern('auth.registration')
  async handleUserRegistration(payload: { email: string; username: string; }) {
    const { email, username } = payload;
    const template = EmailTemplate.WELCOME;
    const subjects = EmailTemplateSubject[template];

    await this.mailService.sendMail({
      to: email,
      subject: subjects,
      emailTemplate: template,
      context: { username },
    });
  }
}
