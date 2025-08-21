const express = require('express');
const router = express.Router();

// Example: health records route
router.get('/', (req, res) => {
  res.json({ message: 'Records route working' });
});

module.exports = router;
