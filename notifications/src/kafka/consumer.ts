import { KafkaTopic, consumer } from "../config/kafka";
import { logger } from "../config/logger";
import { sendNotification } from "../websocket/websocket";

const consumeNotifications = async () => {
  await consumer.subscribe({ topic: KafkaTopic.Notification, fromBeginning: true });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          return;
        }

        logger.info(message.value.toString());

        await sendNotification(message.value.toString());

        await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
      } catch (error) {
        logger.error(`Error kafka listen on ${topic} and partition ${partition}:`, error);
      }
    },
  });
};

export default consumeNotifications;
