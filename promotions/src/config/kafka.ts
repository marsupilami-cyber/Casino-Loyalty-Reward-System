import { Kafka } from "kafkajs";

import { config } from "./config";
import { logger } from "./logger";

export enum KafkaPlayerEvent {
  PlayerRegistered = "PLAYER_REGISTERED",
}

export enum KafkaNotificationsEvent {
  Promotions = "PROMOTIONS",
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
  brokers: config.kafkaBrokers,
  logLevel: 2,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "promotions-group",
  sessionTimeout: 30000,
  heartbeatInterval: 5000,
});

export const connectKafka = async () => {
  await consumer.connect();
  logger.info("Kafka consumer connected successfully");

  await producer.connect();
  logger.info("Kafka producer connected successfully");
};
