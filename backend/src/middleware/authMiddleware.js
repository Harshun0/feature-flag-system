const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super admin only.' });
};

const orgAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'org_admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Org admin only.' });
};

module.exports = { protect, superAdminOnly, orgAdminOnly };
