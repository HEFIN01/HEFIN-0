const express = require('express');
const router = express.Router();

// Example: login route
router.post('/login', (req, res) => {
  res.json({ message: 'Auth login route working' });
});

module.exports = router;
