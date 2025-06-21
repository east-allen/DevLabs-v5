const express = require('express');
const router = express.Router();

// Restore CSRF token
router.get('/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'X-CSRF-Token': csrfToken,
    csrfToken: csrfToken
  });
});

module.exports = router;