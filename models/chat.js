import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin', 'bot'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'read',
    },
  },
  { _id: true, timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      default: '',
    },
    messages: [messageSchema],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadByAdmin: {
      type: Boolean,
      default: false,
    },
    chatMode: {
      type: String,
      enum: ['bot', 'admin'],
      default: 'bot',
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
