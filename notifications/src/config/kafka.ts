import { Kafka } from "kafkajs";

import { config } from "./config";
import { logger } from "./logger";

export enum KafkaTopic {
  Notification = "notification",
}

export enum KafkaNotificationsEvent {
  Promotions = "PROMOTIONS",
  Alert = "ALERT",
}

const kafka = new Kafka({
  clientId: "notifications-service",
  brokers: config.kafkaBrokers,
  logLevel: 2,
});

export const consumer = kafka.consumer({
  groupId: "notifications-group",
  sessionTimeout: 30000,
  heartbeatInterval: 5000,
});

export const connectKafka = async () => {
  await consumer.connect();
  logger.info("Kafka consumer connected successfully");
};
