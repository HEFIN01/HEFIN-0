const express = require('express');
const router = express.Router();

// Example: finance route
router.get('/', (req, res) => {
  res.json({ message: 'Finance route working' });
});

module.exports = router;
