const jwt = require('jsonwebtoken');

function authenticateToken (req, res, next) {
  const jwtHeader = req.header(process.env.JWT_HEADER);

  if (!jwtHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const parts = jwtHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Malformed authorization header' });
  }

  const [prefix, token] = parts;

  if (prefix !== process.env.JWT_TOKEN_PREFIX) {
    return res.status(401).json({ error: 'Invalid token prefix' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.admin = decodedToken.admin
    // req.user = {
    //     userId: decodedToken.userId,
    //     admin: decodedToken.admin
    // };
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', details: e.message });
  }
}

function isAdmin(req, res, next) {
  if (req.admin !== true) {
    return res.status(403).json({ error: 'Access denied: admin only' });
  }
  next();
}

module.exports = {authenticateToken, isAdmin};
