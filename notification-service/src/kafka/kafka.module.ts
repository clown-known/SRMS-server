import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { MailModule } from 'src/mailer/mail.module';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
            connectionTimeout: 20000, 
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
            retry: {
              retries: 30,                
              initialRetryTime: 50000, 
              factor: 2,
            },
          },
          consumer: {
            groupId: 'notification-consumer',
            heartbeatInterval: 2000, 
            sessionTimeout: 600000,  
          },
        },
      },
    ]),
    MailModule,
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
