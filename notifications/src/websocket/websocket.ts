import { saveNotificationToDB } from "../services/notification.service";

import WebSocket, { WebSocketServer } from "ws";

import { config } from "../config/config";
import { logger } from "../config/logger";
import Notification, { NotificationItem } from "../models/notifications";
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

    const unreadNotifications = await Notification.find<NotificationItem>({ user_id: userId, read: false });
    if (unreadNotifications.length > 0) {
      unreadNotifications.forEach((notification) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(notification.content));
        }
      });
      await Notification.updateMany({ user_id: userId, read: false }, { $set: { read: true } });
    }

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

export const sendNotification = async (userId: string, eventType: string, content: any) => {
  const userSockets = clients.get(userId);

  const hasConncectedClient = userSockets && userSockets.size > 0;

  await saveNotificationToDB(userId, content, eventType, hasConncectedClient);

  if (userSockets) {
    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(content));
      }
    });
  }
};
