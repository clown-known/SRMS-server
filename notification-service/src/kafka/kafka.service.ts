import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { MailService } from 'src/mailer/mail.service';
import { EmailTemplate } from 'src/common/enum';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    console.log('Connecting Kafka client...');
    await this.kafkaClient.connect(); 
    console.log('Kafka client connected');
    this.kafkaClient.subscribeToResponseOf('auth.registration'); 
    console.log('Subscribed to auth.registration topic');
  }

}