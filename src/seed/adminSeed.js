// Simple admin seeder (run manually with node src/seed/adminSeed.js)
const mongoose5 = require('mongoose');
const bcrypt2 = require('bcrypt');
const User3 = require('../models/User');
const cfgSeed = require('../config');


async function seed() {
await mongoose5.connect(cfgSeed.mongoUri);
const existing = await User3.findOne({ email: cfgSeed.adminEmail });
if (existing) {
console.log('Admin exists:', existing.email);
process.exit(0);
}
const pass = 'Admin@123';
const hash = await bcrypt2.hash(pass, 10);
const u = new User3({ email: cfgSeed.adminEmail, passwordHash: hash, name: 'HEFIN Admin', role: 'admin' });
await u.save();
console.log('Admin created:', cfgSeed.adminEmail, 'password:', pass);
process.exit(0);
}


if (require.main === module) seed();