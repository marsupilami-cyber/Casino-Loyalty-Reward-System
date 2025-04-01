import { PromotionService } from "../promotions.service";

import { KafkaPlayerEvent, KafkaTopic, consumer } from "../../../../config/kafka";
import { logger } from "../../../../config/logger";

const assignPromotionConsumer = async () => {
  const promotionService = new PromotionService();
  await consumer.subscribe({ topic: KafkaTopic.Player, fromBeginning: true });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          return;
        }
        const messageValue = JSON.parse(message.value.toString());

        const { event_type, user_id } = messageValue;

        if (KafkaPlayerEvent.PlayerRegistered === event_type) {
          await promotionService.assignRegisteredPromotion(user_id);
          logger.info(messageValue);
          await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
        }
      } catch (error) {
        logger.error(`Error kafka listen on ${topic} and partition ${partition}:`, error);
      }
    },
  });
};

export default assignPromotionConsumer;
