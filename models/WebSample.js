import mongoose from 'mongoose';

const webSampleSchema = new mongoose.Schema({
  webName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'New Website',
  },
  priceForTemporary: {
    type: Number,
    default: 199,
  },
  priceForPermanent: {
    type: Number,
    default: 399,
  },
  purchaseCredits: {
    type: Number,
    default: 25,
  },
  imageUrl: {
    url: String,
    filename: String,
  },
  webUrl: {
    type: String,
    required: true,
  },
  isLive: {
    type: Boolean,
    default: true,
  },
  soldOut: {
    type: Number,
    default: 0,
  },
  imageNeeded: {
    type: Number,
    default: 5,
  },
  tags: [{ type: String }],
  priority: {
    type: Number,
    default: 0,
  },
});

webSampleSchema.index({ priority: -1, _id: -1 });

export const WebSample = mongoose.models.WebSample || mongoose.model('WebSample', webSampleSchema);
