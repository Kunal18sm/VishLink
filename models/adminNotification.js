import mongoose from 'mongoose';

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['NEW_USER_SIGNUP', 'TEMPLATE_SALE', 'ADMIN_ALERT'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);
