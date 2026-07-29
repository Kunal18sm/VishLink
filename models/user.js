import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    default: '',
  },
  googleId: {
    type: String,
    default: '',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  coins: {
    type: Number,
    default: 100,
  },
  winnerCount: {
    type: Number,
    default: 0,
  },
  dailyCreditClaim: {
    dateKey: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    claimedAt: { type: Date, default: null },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  webCollection: [
    {
      webName: String,
      dateOfBuy: { type: Date, default: Date.now },
      receiver: String,
      price: { type: Number, default: 0 },
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
      isFakePaymentProof: {
        type: Boolean,
        default: false,
      },
      adminFakePaymentNote: {
        type: String,
        default: '',
      },
      adminActionAt: Date,
      permanentLink: String,
      paymentProofUrl: mongoose.Schema.Types.Mixed,
      purchasedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchasedWeb',
      },
    },
  ],
}, { strict: false });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
