const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── protect middleware ───────────────────────────────────────────────────────
// Attaches the logged-in user to req.user so downstream route handlers
// know WHO is making the request.  If no valid token is present, we stop
// the request here and return 401 Unauthorised.
const protect = async (req, res, next) => {
  try {
    // JWT is sent in the Authorization header as:  "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised — no token' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    // jwt.verify throws an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user document to the request (excluding the password hash)
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorised — user not found' });
    }

    next(); // Token is valid — proceed to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised — invalid token' });
  }
};

// ─── adminOnly middleware ─────────────────────────────────────────────────────
// Used AFTER protect.  Allows only users with role "admin" to proceed.
// This guards routes like POST /api/products (add a new product).
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden — admins only' });
};

module.exports = { protect, adminOnly };
