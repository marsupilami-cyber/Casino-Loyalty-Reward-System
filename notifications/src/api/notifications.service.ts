import { KafkaTopic, consumer } from "../config/kafka";
import { logger } from "../config/logger";

const consumeNotifications = async () => {
  await consumer.subscribe({ topic: KafkaTopic.Notification, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          return;
        }
        const messageValue = JSON.parse(message.value.toString());
        logger.info(messageValue);
      } catch (error) {
        logger.error(`Error kafka listen on ${topic} and partition ${partition}:`, error);
      }
    },
  });
};

export default consumeNotifications;
