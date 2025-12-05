const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const payload = jwt.verify(token, JWT_SECRET);
    // load user from users.json
    const usersPath = path.join(__dirname, '..', 'data', 'users.json');
    const users = await fs.readJson(usersPath);
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
}

// restrict to admin role
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

module.exports = { requireAuth, requireAdmin };
