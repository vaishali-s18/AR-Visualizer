import { useEffect, useState } from 'react';
import api from '../api/axios';
import './AnalyticsView.css';

// ─── AnalyticsView ────────────────────────────────────────────────────────────
// Shows aggregated stats per product: how many times it was viewed,
// opened in AR, and had the "Buy" button clicked.
// This tells us which products drive the most affiliate revenue.
const AnalyticsView = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/analytics/summary');
        setSummary(data);
      } catch {
        setError('Failed to load analytics. Make sure you are logged in as admin.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Extract a specific event count from the events array for a product row
  const getCount = (events, type) => {
    const found = events?.find((e) => e.eventType === type);
    return found ? found.count : 0;
  };

  // Overall totals for the summary cards at the top
  const totals = summary.reduce(
    (acc, row) => ({
      views:   acc.views   + getCount(row.events, 'product_viewed'),
      ar:      acc.ar      + getCount(row.events, 'ar_opened'),
      buys:    acc.buys    + getCount(row.events, 'buy_clicked'),
    }),
    { views: 0, ar: 0, buys: 0 }
  );

  return (
    <div className="page">
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Track views, AR opens, and buy clicks per product.</p>

      {error && <div className="error-message">{error}</div>}

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <p className="analytics-card-value">{totals.views}</p>
          <p className="analytics-card-label">Total Product Views</p>
        </div>
        <div className="analytics-card">
          <p className="analytics-card-value" style={{ color: 'var(--accent-2)' }}>{totals.ar}</p>
          <p className="analytics-card-label">Total AR Opens</p>
        </div>
        <div className="analytics-card">
          <p className="analytics-card-value" style={{ color: '#4ade80' }}>{totals.buys}</p>
          <p className="analytics-card-label">Total Buy Clicks</p>
        </div>
      </div>

      {/* ── Per-product table ─────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 48 }} />)}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>👁 Views</th>
                <th>📱 AR Opens</th>
                <th>🛒 Buy Clicks</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => {
                const views = getCount(row.events, 'product_viewed');
                const ar    = getCount(row.events, 'ar_opened');
                const buys  = getCount(row.events, 'buy_clicked');
                // Conversion = buy clicks / views × 100
                const conv  = views > 0 ? ((buys / views) * 100).toFixed(1) : '—';

                return (
                  <tr key={row._id}>
                    <td className="td-name">{row.product?.name || 'Unknown'}</td>
                    <td>{views}</td>
                    <td>{ar}</td>
                    <td>{buys}</td>
                    <td>
                      <span className={`conv-badge ${buys > 0 ? 'conv-positive' : ''}`}>
                        {conv}{typeof conv === 'string' ? '' : '%'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {summary.length === 0 && !error && (
            <div className="empty-state">
              <p>No analytics events recorded yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Events are logged when users view products, open AR, or click Buy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
