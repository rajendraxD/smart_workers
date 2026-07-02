import mongoose from 'mongoose';
import { NOTIFICATION_EVENTS } from '../utils/constants.js';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: String, enum: Object.values(NOTIFICATION_EVENTS), required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
