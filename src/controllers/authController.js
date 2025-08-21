const bcrypt = require('bcrypt');
const jwt2 = require('jsonwebtoken');
const User2 = require('../models/User');
const cfg3 = require('../config');


const AuthController = {
async register(req, res) {
try {
const { email, password, name, role } = req.body;
if (!email || !password) return res.status(400).json({ error: 'email & password required' });
const existing = await User2.findOne({ email });
if (existing) return res.status(409).json({ error: 'User already exists' });
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
const u = new User2({ email, passwordHash, name, role });
await u.save();
return res.status(201).json({ id: u._id, email: u.email, name: u.name });
} catch (err) {
return res.status(500).json({ error: 'Registration failed', detail: err.message });
}
},


async login(req, res) {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ error: 'email & password required' });
const user = await User2.findOne({ email });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.passwordHash);
if (!match) return res.status(401).json({ error: 'Invalid credentials' });
const token = jwt2.sign({ sub: user._id, role: user.role }, cfg3.jwtSecret, {
expiresIn: cfg3.jwtExpiresIn
});
return res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
} catch (err) {
return res.status(500).json({ error: 'Login failed', detail: err.message });
}
}
};


module.exports = AuthController;