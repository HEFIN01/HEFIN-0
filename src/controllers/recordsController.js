const PatientRecord = require('../models/PatientRecord');
const icpService = require('../services/icpService');


const RecordsController = {
// Upload a medical record payload (sensitive data should be pre-anonymized on client or server)
async uploadRecord(req, res) {
try {
// Expect JSON payload in body -> we'll store via ICP placeholder and save pointer
const { ownerId, payload, metadata, consent } = req.body;
if (!ownerId || !payload) return res.status(400).json({ error: 'ownerId and payload required' });
const pointer = await icpService.storeData({ payload, metadata });
const rec = new PatientRecord({ owner: ownerId, dataPointer: pointer, metadata, consent });
await rec.save();
return res.status(201).json({ id: rec._id, pointer });
} catch (err) {
return res.status(500).json({ error: 'Upload failed', detail: err.message });
}
},


async getRecord(req, res) {
try {
const { id } = req.params;
const rec = await PatientRecord.findById(id).populate('owner', 'email name');
if (!rec) return res.status(404).json({ error: 'Not found' });
const data = await icpService.fetchData(rec.dataPointer);
return res.json({ record: rec, data });
} catch (err) {
return res.status(500).json({ error: 'Fetch failed', detail: err.message });
}
},


async listRecordsForUser(req, res) {
try {
const { userId } = req.params;
const list = await PatientRecord.find({ owner: userId }).sort({ createdAt: -1 });
return res.json({ records: list });
} catch (err) {
return res.status(500).json({ error: 'List failed', detail: err.message });
}
}
};


module.exports = RecordsController;