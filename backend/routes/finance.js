// backend/routes/finance.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FinancialRecord = require('../models/FinancialRecord');
const crypto = require('crypto'); // For hashing data

// @route   POST api/finance/transaction
// @desc    Add a new financial transaction (off-chain) and register hash on ICP
// @access  Private
router.post('/transaction', auth, async (req, res) => {
  const { transactionType, amount, currency, description } = req.body;
  const userId = req.user.id;
  const icpPrincipal = req.user.icpPrincipal;

  if (!req.icpActor) {
    return res.status(500).json({ msg: 'ICP Canister Actor not initialized.' });
  }

  try {
    // 1. Create hash of the financial data
    const dataString = JSON.stringify({ transactionType, amount, currency, description, userId }); // Include userId for unique hash
    const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

    // 2. Save financial record to MongoDB (off-chain)
    const newRecord = new FinancialRecord({
      userId,
      transactionType,
      amount,
      currency,
      description,
      icpReferenceHash: dataHash,
      status: 'pending' // Initial status
    });
    await newRecord.save();

    // 3. Register the hash on the ICP canister for transparency/immutability
    const icpResponse = await req.icpActor.registerDataReference(dataHash, "TRANSACTION_PENDING");

    // Placeholder for AI fraud detection or smart contract claims processing
    // In a real system, you'd trigger AI here, or a separate ICP smart contract call
    // Example: call an AI service to analyze 'newRecord.data' for fraud
    // Example: call another ICP canister for automated claims processing based on 'newRecord'

    res.json({ msg: 'Financial transaction added and reference registered on ICP', record: newRecord, icpResponse });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/finance/mytransactions
// @desc    Get all financial transactions for the authenticated user
// @access  Private
router.get('/mytransactions', auth, async (req, res) => {
  try {
    const records = await FinancialRecord.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
