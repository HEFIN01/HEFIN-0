const Transaction = require('../models/Transaction');
const icp = require('../services/icpService');


const FinanceController = {
async createTransaction(req, res) {
try {
const { userId, amount, type, currency, meta } = req.body;
if (!userId || !amount) return res.status(400).json({ error: 'userId & amount required' });
const tx = new Transaction({ user: userId, amount, type, currency, meta });
await tx.save();
// Optionally store a hashed summary on ICP as audit
const auditPointer = await icp.storeData({ txId: tx._id, userId, amount, type, ts: Date.now() });
tx.meta = { ...tx.meta, auditPointer };
await tx.save();
return res.status(201).json({ id: tx._id, status: tx.status, auditPointer });
} catch (err) {
return res.status(500).json({ error: 'Create tx failed', detail: err.message });
}
},


async getTransaction(req, res) {
try {
const { id } = req.params;
const tx = await Transaction.findById(id).populate('user', 'email name');
if (!tx) return res.status(404).json({ error: 'Not found' });
return res.json({ tx });
} catch (err) {
return res.status(500).json({ error: 'Get tx failed', detail: err.message });
}
},


async listRecent(req, res) {
try {
const list = await Transaction.find({}).sort({ createdAt: -1 }).limit(100);
return res.json({ transactions: list });
} catch (err) {
return res.status(500).json({ error: 'List failed', detail: err.message });
}
}
};


module.exports = FinanceController;