const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
email: { type: String, required: true, unique: true, lowercase: true },
passwordHash: { type: String, required: true },
name: { type: String },
role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
createdAt: { type: Date, default: Date.now },
meta: { type: Schema.Types.Mixed }
});


module.exports = mongoose.model('User', UserSchema);