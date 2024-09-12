import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'notification-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3004);
}
bootstrap();
