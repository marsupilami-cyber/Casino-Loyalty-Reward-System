import { Kafka } from "kafkajs";

import { config } from "./config";
import { logger } from "./logger";

export enum KafkaTopic {
  Notification = "notification",
}

const kafka = new Kafka({
  clientId: "notifications-service",
  brokers: [config.kafkaBroker],
  logLevel: 2,
});

export const consumer = kafka.consumer({ groupId: "notifications-group" });

export const connectKafka = async () => {
  consumer.on("consumer.connect", () => {
    logger.info("Kafka consumer connected successfully");
  });

  await consumer.connect();
};
