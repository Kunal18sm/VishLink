import mongoose from 'mongoose';

const purchasedWebSchema = new mongoose.Schema({
  purchaseId: {
    type: String,
    required: true,
  },
  webUrl: {
    type: String,
    required: true,
  },
  webName: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  purchaseMode: {
    type: String,
    enum: ['upi', 'coins'],
    default: 'upi',
  },
  paidCredits: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  paymentProofUrl: {
    url: String,
    filename: String,
  },
  specialMsg: [
    {
      type: String,
      required: true,
    },
  ],
  musicTrack: {
    type: String,
    default: 'Romantic Instrumental',
  },
  themeColor: {
    type: String,
    default: 'Rose Pink',
  },
  isLive: {
    type: Boolean,
    default: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isTemporary: {
    type: Boolean,
    default: true,
  },
});

purchasedWebSchema.index({ purchaseId: 1 });
purchasedWebSchema.index({ author: 1, date: -1 });

export const PurchasedWeb = mongoose.models.PurchasedWeb || mongoose.model('PurchasedWeb', purchasedWebSchema);
