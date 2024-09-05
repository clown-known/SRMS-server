import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.TCP,
  //   options: { host: '0.0.0.0', port: 3001 },
  // });
  // await app.listen();
}
bootstrap();

