const express = require('express');
const router = express.Router();

const usersRouter = require('./users.js');
const sessionRouter = require('./session.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const csrfRouter = require('./csrf.js');

router.use('/csrf', csrfRouter);
router.use('/users', usersRouter);
router.use('/session', sessionRouter);
router.use('/spots', spotsRouter);
router.use('/properties', spotsRouter); // Alias for spots
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);

router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;