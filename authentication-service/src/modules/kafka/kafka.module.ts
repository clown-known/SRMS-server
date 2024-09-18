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

            brokers: ['localhost:9092'],

          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
          },
          consumer: {
            groupId: 'notification-consumer',
            heartbeatInterval: 1000,
            sessionTimeout: 30000,

          },

        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
