import { Kafka } from "kafkajs";

import { config } from "./config";
import { logger } from "./logger";

export enum KafkaPlayerEvent {
  PlayerRegistered = "PLAYER_REGISTERED",
}

export enum KafkaTopic {
  Player = "player",
  Notification = "notification",
}
export type KafkaRegisterPlayerEvent = {
  user_id: string;
  event_type: KafkaPlayerEvent;
};

const kafka = new Kafka({
  clientId: "promotions-service",
  brokers: [config.kafkaBroker],
  logLevel: 2,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "promotions-group" });

export const connectKafka = async () => {
  producer.on("producer.connect", () => {
    logger.info("Kafka producer connected successfully");
  });

  consumer.on("consumer.connect", () => {
    logger.info("Kafka consumer connected successfully");
  });

  await consumer.connect();
  await producer.connect();
};
