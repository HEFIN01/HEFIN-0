// backend/models/HealthRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HealthRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recordType: { type: String, required: true }, // e.g., 'diagnosis', 'prescription', 'lab_result'
  data: { type: Object, required: true }, // Actual health data (off-chain)
  icpReferenceHash: { type: String, unique: true, sparse: true }, // Hash stored on ICP
  date: { type: Date, default: Date.now },
  // Additional fields for AI analysis, consent, etc.
  anonymizedForAI: { type: Boolean, default: false },
  sharedForResearch: { type: Boolean, default: false },
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
