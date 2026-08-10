const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables from .env FIRST — before anything else reads them
dotenv.config();

// Initialize Express
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());         // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse JSON request bodies automatically

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── API Routes ───────────────────────────────────────────────────────────────
// We mount each router at its base path.
// Any request to /api/auth/... is handled by authRoutes, etc.
app.use('/api/auth',      require('./src/routes/authRoutes'));
app.use('/api/products',  require('./src/routes/productRoutes'));
app.use('/api/designs',   require('./src/routes/designRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AR Visualizer API is running!' });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
// If no route matches, return a clean JSON error instead of an HTML page
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
