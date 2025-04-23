const jwt = require('jsonwebtoken');
const config = require('config');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.get('jwtSecret'),
    { expiresIn: '1h' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, config.get('jwtSecret'));
};

module.exports = {
  generateToken,
  verifyToken
};