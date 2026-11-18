import api from './axios';

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Analytics event logger.
 * In mock mode (no backend) this is a no-op — avoids ERR_CONNECTION_REFUSED noise.
 * In production with a live backend it fires-and-forgets to /api/analytics/event.
 *
 * eventType: 'product_viewed' | 'ar_opened' | 'buy_clicked' | 'design_created' etc.
 */
export const logEvent = (eventType, productId) => {
  if (MOCK_MODE) return;
  // Fire-and-forget — analytics must never break the main UX.
  api.post('/api/analytics/event', { eventType, productId }).catch(() => {});
};
