import { Kafka } from "kafkajs";

import { config } from "./config";
import { logger } from "./logger";

export enum KafkaEvent {
  PlayerRegistered = "PLAYER_REGISTERED",
}

export enum KafkaTopic {
  Player = "player",
}

const kafka = new Kafka({
  clientId: "users-service",
  brokers: config.kafkaBrokers,
  logLevel: 2,
});

export const producer = kafka.producer();

export const connectKafka = async () => {
  await producer.connect();
  logger.info("Kafka producer connected successfully");
};
