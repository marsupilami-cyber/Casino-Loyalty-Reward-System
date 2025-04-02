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
  const admin = kafka.admin();

  await admin.connect();

  try {
    const existingTopics = await admin.listTopics();

    const topicsToCreate = Object.values(KafkaTopic).map((topic) => ({
      topic,
      numPartitions: 3,
      replicationFactor: 3,
    }));

    const newTopics = topicsToCreate.filter((topic) => !existingTopics.includes(topic.topic));

    if (newTopics.length > 0) {
      await admin.createTopics({ topics: newTopics });
    }
  } catch (error) {
    logger.error("Error while creating Kafka topics:", error);
  } finally {
    await admin.disconnect();
  }

  await producer.connect();
  logger.info("Kafka producer connected successfully");
};
