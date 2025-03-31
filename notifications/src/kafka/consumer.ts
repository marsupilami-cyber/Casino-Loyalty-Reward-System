import { saveNotificationToDB } from "../services/notification.service";

import { KafkaTopic, consumer } from "../config/kafka";
import { logger } from "../config/logger";
import { sendNotification } from "../websocket/websocket";

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

        const { user_id: userId, content, event_type: eventType } = messageValue;

        await sendNotification(userId, eventType, content);
      } catch (error) {
        logger.error(`Error kafka listen on ${topic} and partition ${partition}:`, error);
      }
    },
  });
};

export default consumeNotifications;
