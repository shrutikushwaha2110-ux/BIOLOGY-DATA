const jwt = require('jsonwebtoken');

// Mock admin credentials (in production, use database + bcrypt)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check credentials (mock - in production validate against DB with bcrypt)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT token
      const token = jwt.sign(
        { username, role: 'admin' },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        role: 'admin',
        username,
      });
    }

    // For demo: allow any other login attempt as non-admin user
    const token = jwt.sign(
      { username, role: 'user' },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful (user role)',
      token,
      role: 'user',
      username,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { adminLogin };
