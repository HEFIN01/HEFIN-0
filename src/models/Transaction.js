const mongoose3 = require('mongoose');
const { Schema: S3 } = mongoose3;


const TransactionSchema = new S3({
user: { type: S3.Types.ObjectId, ref: 'User' },
type: { type: String, enum: ['payment', 'claim', 'loan', 'trade'], default: 'payment' },
amount: { type: Number, required: true },
currency: { type: String, default: 'USD' },
status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
meta: { type: S3.Types.Mixed },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose3.model('Transaction', TransactionSchema);