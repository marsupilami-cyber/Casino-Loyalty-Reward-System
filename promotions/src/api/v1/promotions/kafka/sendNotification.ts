import Promotion from "../models/promotions.model";

import { KafkaNotificationsEvent, KafkaTopic, producer } from "../../../../config/kafka";
import { logger } from "../../../../config/logger";

export const sendNotificationProducer = async (userId: string, promotion: Promotion) => {
  const topic = KafkaTopic.Notification;
  const eventData = {
    user_id: userId,
    content: promotion,
    event_type: KafkaNotificationsEvent.Promotions,
    acks: -1,
  };
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(eventData) }],
    });
  } catch (error) {
    logger.error(`Failed to send notification to user id: '${userId}' on topic ${topic}`);
  }
};
