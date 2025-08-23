// backend/models/FinancialRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinancialRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactionType: { type: String, required: true }, // e.g., 'payment', 'claim', 'loan'
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: { type: String },
  icpReferenceHash: { type: String, unique: true, sparse: true }, // Hash stored on ICP
  date: { type: Date, default: Date.now },
  // Fields for fraud detection, credit scoring, etc.
  status: { type: String, default: 'pending' }, // e.g., 'pending', 'approved', 'rejected', 'fraud_alert'
});

module.exports = mongoose.model('FinancialRecord', FinancialRecordSchema);
