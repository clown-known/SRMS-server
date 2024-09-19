import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SendMailDTO } from './mail.dto';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emitRegisterEmail(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Welcome to our website',
      emailTemplate: 'WELCOME',
      context: { username }
    };

    try {
      await this.kafkaClient.emit('auth.registration', sendMailDto);
      console.log('Registration email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting registration email event:', error);
      throw error;
    }
  }

  async emitAuthenCode(email: string, authCode: string) {
    const sendMailDto: SendMailDTO = {
        to: email,
        subject: 'Your Authentication Code',
        emailTemplate: 'PASSWORD_RESET',
        context: {
            authCode, 
        },
    };

    try {
        console.log(`Emitting auth code to Kafka for email: ${email}`);
        await this.kafkaClient.emit('auth.authcode', sendMailDto);
        console.log('Auth code email event emitted:', sendMailDto);
    } catch (error) {
        console.error('Error emitting auth code email event:', error);
        throw error;
    }
}
}