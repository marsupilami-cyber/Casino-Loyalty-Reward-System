import Notification, { NotificationItem } from "../models/notifications";

export const saveNotificationToDB = async (userId: string, notification: NotificationItem) => {
  try {
    const notificationDoc = await Notification.findOne({ user_id: userId });

    if (notificationDoc) {
      notificationDoc.notifications.push(notification);

      await notificationDoc.save();
    } else {
      const newNotification = new Notification({
        user_id: userId,
        notifications: [notification],
      });

      await newNotification.save();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to save notification to DB: " + error.message);
    }
  }
};
