import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
        connectionTimeout: 20000,
        requestTimeout: 600000, 
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'notification-consumer',
        heartbeatInterval: 1000,
        sessionTimeout: 300000,
        retry: {
          retries: 30, 
          initialRetryTime: 30000, 
          factor: 2,
          maxRetryTime: 600000,
        },
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
