const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const jwtHeader = req.header(process.env.JWT_HEADER);
const prefix = jwtHeader.split(' ')[0];
const token = jwtHeader.split(' ')[1];

if (!prefix.includes(process.env.JWT_TOKEN_PREFIX)) 
    return res.status(401).json({ error: 'Access denied' });
if (!token) 
    return res.status(401).json({ error: 'Access denied' });
try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    req.userId = decodedToken.userId;
    next();
} catch (e) {
    res.status(401).json({ error: 'Invalid token ' + e});
} 
};

module.exports = verifyToken;