import Notification from "../models/notifications";

export const saveNotificationToDB = async (userId: string, content: any, eventType: string, read = false) => {
  try {
    const notification = new Notification({
      user_id: userId,
      notifications: [
        {
          type: eventType,
          content: content,
          read,
        },
      ],
    });

    await notification.save();
  } catch (error) {
    throw new Error("Failed to save notification to DB");
  }
};
