const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables from .env FIRST — before anything else reads them
dotenv.config();

// Initialize Express
const app = express();

const path = require('path');

// ─── Global Middleware ────────────────────────────────────────────────────────
// Restrict CORS to configured client origins, local networks, or public dev tunnels (ngrok/localtunnel)
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    const isLocal = origin.startsWith('http://localhost') || 
                    origin.startsWith('https://localhost') ||
                    origin.startsWith('http://127.0.0.1') || 
                    origin.startsWith('https://127.0.0.1') || 
                    /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
                    /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
                    /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

    const isTunnelOrCloud = origin.includes('ngrok') ||
                            origin.includes('localtunnel.me') ||
                            origin.includes('trycloudflare.com') ||
                            origin.includes('vercel.app') ||
                            origin.includes('netlify.app') ||
                            origin.includes('onrender.com');

    if (isLocal || isTunnelOrCloud || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));

// Serve static 3D models with explicit MIME type and open CORS for Android Scene Viewer & WebXR
const modelsPath = path.join(__dirname, '../frontend/public/models');
app.use('/models', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.path.endsWith('.glb')) {
    res.setHeader('Content-Type', 'model/gltf-binary');
  } else if (req.path.endsWith('.gltf')) {
    res.setHeader('Content-Type', 'model/gltf+json');
  } else if (req.path.endsWith('.usdz')) {
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
  }
  next();
}, express.static(modelsPath));

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
app.use('/api/favorites', require('./src/routes/favoriteRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AR Visualizer API is running!' });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
// If no route matches, return a clean JSON error instead of an HTML page
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// 4-argument signature signals Express this is an error-handling middleware.
// Any route that calls next(err) will land here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
