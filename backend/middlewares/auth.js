const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; 

    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next(); 
  };
};

module.exports = { protect,authorizeRole };
