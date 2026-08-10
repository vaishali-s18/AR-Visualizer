const express = require('express');
const router = express.Router();
const { logEvent, getSummary } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/analytics/event   — public (guests and logged-in users both log events)
router.post('/event', logEvent);

// GET /api/analytics/summary  — admin only (aggregated stats dashboard)
router.get('/summary', protect, adminOnly, getSummary);

module.exports = router;
