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

  await consumer.connect();
  logger.info("Kafka consumer connected successfully");
};
