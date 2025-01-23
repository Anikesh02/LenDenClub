const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

const auth = {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },

  comparePasswords: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  generateToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  },

  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};



module.exports = auth;