const dotenv = require('dotenv');
const path = require('path');


dotenv.config({ path: path.resolve(process.cwd(), '.env') });


module.exports = {
port: process.env.PORT || 4000,
mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hefin',
jwtSecret: process.env.JWT_SECRET || 'change_this',
jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
icpEndpoint: process.env.ICP_API_ENDPOINT || 'https://icp.example/placeholder',
adminEmail: process.env.ADMIN_EMAIL || 'admin@hefin.local'
};