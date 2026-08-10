import api from './axios';

/**
 * Analytics API helper
 * WHY: Every time a user views a product, opens AR, or clicks "Buy",
 * we log it. This is how we track which products drive revenue (buy_clicked
 * events correlate with affiliate commissions).
 *
 * eventType: 'product_viewed' | 'ar_opened' | 'buy_clicked'
 */
export const logEvent = (eventType, productId) => {
  // Fire-and-forget — we don't await this or show errors to users.
  // Analytics should never break the main user experience.
  api.post('/api/analytics/event', { eventType, productId }).catch(() => {});
};
