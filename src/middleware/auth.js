const jwt = require('jsonwebtoken');
const cfg2 = require('../config');
const User = require('../models/User');


async function authMiddleware(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });
const token = authHeader.replace(/^Bearer\s+/i, '');
try {
const decoded = jwt.verify(token, cfg2.jwtSecret);
const user = await User.findById(decoded.sub).select('-passwordHash');
if (!user) return res.status(401).json({ error: 'Invalid token (user not found)' });
req.user = user;
next();
} catch (err) {
return res.status(401).json({ error: 'Invalid token' });
}
}


module.exports = authMiddleware;