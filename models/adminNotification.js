import mongoose from 'mongoose';

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'general',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/requests/dashboard',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-delete notifications from DB after 24 hours (86400 seconds)
adminNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);
