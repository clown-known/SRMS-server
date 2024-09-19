import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
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
            connectionTimeout: 10000,
            requestTimeout: 300000,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
            retry: {
              retries: 20,
              initialRetryTime: 30000, 
              factor: 2,
            },
          },
          consumer: {
            groupId: 'notification-consumer',
            heartbeatInterval: 1000,
            sessionTimeout: 300000,

          },

        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
