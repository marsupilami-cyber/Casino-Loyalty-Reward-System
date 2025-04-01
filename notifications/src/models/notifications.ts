import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  Promotion = "promotion",
  Others = "others",
}

export interface NotificationItem {
  type: NotificationType;
  content: mongoose.Schema.Types.Mixed;
  read: boolean;
}

interface NotificationInterface extends Document {
  user_id: string;
  notifications: NotificationItem[];
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema = new Schema<NotificationInterface>(
  {
    user_id: {
      type: String,
      required: true,
    },
    notifications: [
      {
        type: {
          type: String,
          enum: Object.values(NotificationType),
          required: true,
        },
        content: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<NotificationInterface>("Notification", NotificationSchema);
