const mongoose2 = require('mongoose');
const { Schema: S2 } = mongoose2;


const MedicalRecordSchema = new S2({
owner: { type: S2.Types.ObjectId, ref: 'User', required: true },
// hashed/anonymized data pointer (could be IPFS/ICP canister id)
dataPointer: { type: String, required: true },
metadata: { type: S2.Types.Mixed },
consent: {
permittedParties: [{ type: String }],
terms: { type: String }
},
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose2.model('PatientRecord', MedicalRecordSchema);