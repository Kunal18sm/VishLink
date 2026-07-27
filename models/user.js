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
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
