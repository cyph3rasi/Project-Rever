const authMiddleware = (req, res, next) => {
  if (!req.session.walletAddress) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

module.exports = authMiddleware;