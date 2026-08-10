const AnalyticsEvent = require('../models/AnalyticsEvent');

// ─── POST /api/analytics/event (public) ──────────────────────────────────────
// Logs a user action event.  Public so even guests (no JWT) can be tracked.
// eventType must be: "product_viewed" | "ar_opened" | "buy_clicked"
const logEvent = async (req, res) => {
  try {
    const { eventType, productId } = req.body;

    // userId is optional — extract from the Authorization header if present.
    // We do this manually here because this route is NOT protected by middleware.
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (_) {
        // If token is invalid, just treat the user as a guest — don't error out
      }
    }

    const event = await AnalyticsEvent.create({ eventType, productId, userId });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── GET /api/analytics/summary (admin only) ─────────────────────────────────
// Returns aggregated stats per product: how many views, AR opens, and buy clicks.
// Uses MongoDB's aggregation pipeline — a powerful way to group and count documents.
const getSummary = async (req, res) => {
  try {
    const summary = await AnalyticsEvent.aggregate([
      {
        // $group groups documents by productId + eventType and counts each combination
        $group: {
          _id: { productId: '$productId', eventType: '$eventType' },
          count: { $sum: 1 },
        },
      },
      {
        // $group again to reshape: one document per product with all event counts together
        $group: {
          _id: '$_id.productId',
          events: {
            $push: { eventType: '$_id.eventType', count: '$count' },
          },
        },
      },
      {
        // $lookup does a "join" — pulls the product name from the Product collection
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmpty: true } },
      { $sort: { '_id': -1 } },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logEvent, getSummary };
