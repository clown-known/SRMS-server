import { Injectable } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER_1, process.env.KAFKA_BROKER_2, process.env.KAFKA_BROKER_3],
  });

  private producer: Producer = this.kafka.producer();
  private consumer: Consumer = this.kafka.consumer({ groupId: 'notification-group' });

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribeToTopic(topic: string, onMessage: (message: any) => void) {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        onMessage(message);
      },
    });
  }
}
