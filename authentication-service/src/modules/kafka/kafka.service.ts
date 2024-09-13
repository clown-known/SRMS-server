import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}


  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sendRegisterEmail(email: string, username: string){
    await this.kafkaClient.emit('auth.registration', {
      email,
      username,
    });
  }
}
