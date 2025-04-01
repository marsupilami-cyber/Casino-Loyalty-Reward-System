import { saveNotificationToDB } from "../services/notification.service";

import WebSocket, { WebSocketServer } from "ws";

import { config } from "../config/config";
import { KafkaNotificationsEvent } from "../config/kafka";
import { logger } from "../config/logger";
import Notification, { NotificationItem, NotificationType } from "../models/notifications";
import { authenticateWebSocket } from "./verifyToken";

const clients = new Map<string, Set<WebSocket>>();

export const setupWebSocket = () => {
  const wss = new WebSocketServer({ port: config.port });

  wss.on("connection", async (ws, req) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      ws.close();
      return;
    }

    const user = authenticateWebSocket(token);

    if (!user) {
      ws.close();
      logger.error("Invalid token");
      return;
    }

    if (!user.active) {
      ws.close();
      logger.error("Deactivated user");
      return;
    }

    const userId = user.userId;
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId)!.add(ws);
    logger.info(`User ${userId} connected`);

    ws.on("close", () => {
      clients.get(userId)?.delete(ws);
      if (clients.get(userId)?.size === 0) {
        clients.delete(userId);
      }
      logger.info(`User ${userId} disconnected`);
    });
  });

  return wss;
};

export const sendNotification = async (notificationMessage: string) => {
  const messageValue = JSON.parse(notificationMessage);

  const { user_id: userId, content, event_type: eventType } = messageValue;

  const userSockets = clients.get(userId);

  let isRead = (userSockets && userSockets.size > 0) || false;

  if (userSockets) {
    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(notification.content), (error) => {
          if (error) {
            isRead = false;
            logger.error("Failed to send notification: " + error.message);
          }
        });
      }
    });
  }

  const notification: NotificationItem = {
    content,
    read: isRead,
    type: NotificationType.Others,
  };

  if (eventType === KafkaNotificationsEvent.Promotions) {
    notification.type = NotificationType.Promotion;
  }

  await saveNotificationToDB(userId, notification);
};
