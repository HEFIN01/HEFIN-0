// backend/routes/health.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');
const crypto = require('crypto'); // For hashing data

// @route   POST api/health/record
// @desc    Add a new health record (off-chain) and register hash on ICP
// @access  Private
router.post('/record', auth, async (req, res) => {
  const { recordType, data, anonymizedForAI, sharedForResearch } = req.body;
  const userId = req.user.id;
  const icpPrincipal = req.user.icpPrincipal;

  if (!req.icpActor) {
    return res.status(500).json({ msg: 'ICP Canister Actor not initialized.' });
  }

  try {
    // 1. Create hash of the health data
    const dataString = JSON.stringify(data);
    const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

    // 2. Save health record to MongoDB (off-chain)
    const newRecord = new HealthRecord({
      userId,
      recordType,
      data,
      icpReferenceHash: dataHash, // Store the hash in MongoDB too
      anonymizedForAI,
      sharedForResearch,
    });
    await newRecord.save();

    // 3. Register the hash and initial consent status on the ICP canister
    // This is where the user's data ownership & consent is recorded on-chain.
    const consentStatus = sharedForResearch ? "GRANTED" : "PENDING"; // Simplified consent
    const icpResponse = await req.icpActor.registerDataReference(dataHash, consentStatus);

    res.json({ msg: 'Health record added and reference registered on ICP', record: newRecord, icpResponse });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/health/myrecords
// @desc    Get all health records for the authenticated user
// @access  Private
router.get('/myrecords', auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/health/verify-icp/:dataHash
// @desc    Verify a health record hash and consent status on ICP (e.g., for a hospital client)
// @access  Private (but in real scenario, this endpoint could be more public/authenticated for specific partners)
router.get('/verify-icp/:userPrincipal/:dataHash', auth, async (req, res) => {
  if (!req.icpActor) {
    return res.status(500).json({ msg: 'ICP Canister Actor not initialized.' });
  }

  try {
    const { userPrincipal, dataHash } = req.params;
    // Call the ICP canister to verify the hash and consent
    const isVerified = await req.icpActor.verifyDataHashAndConsent(userPrincipal, dataHash);

    res.json({ dataHash, userPrincipal, isVerified });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Add more routes for updating records, managing consent, etc.

module.exports = router;
