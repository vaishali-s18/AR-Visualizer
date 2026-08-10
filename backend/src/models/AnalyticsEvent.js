const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['product_viewed', 'ar_opened', 'buy_clicked'],
      required: true,
    },
    // Which product was interacted with
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Which user did this (null if they are a guest)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true } // Uses timestamps instead of a custom 'timestamp' field for consistency
);

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
