// backend/routes/api/bookings.js
const express = require('express');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validate booking creation/update
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('startDate must be a valid date'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('endDate must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors
];

// Get all bookings of the current user
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
      }
    ]
  });
  
  return res.json({ Bookings: bookings });
});

// Edit a booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404
    });
  }
  
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  // Check if booking is in the past
  const currentDate = new Date();
  if (new Date(booking.endDate) < currentDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
      statusCode: 403
    });
  }
  
  const { startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if startDate is in the past
  if (start < currentDate) {
    return res.status(400).json({
      message: "startDate cannot be in the past",
      statusCode: 400
    });
  }
  
  // Check for booking conflicts
  const conflictingBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      id: { [Op.ne]: booking.id },
      [Op.or]: [
        { startDate: { [Op.between]: [start, end] } },
        { endDate: { [Op.between]: [start, end] } },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: start } },
            { endDate: { [Op.gte]: end } }
          ]
        }
      ]
    }
  });
  
  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      statusCode: 403,
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    });
  }
  
  await booking.update({
    startDate,
    endDate
  });
  
  return res.json(booking);
});

// Delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId, {
    include: [{ model: Spot }]
  });
  
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404
    });
  }
  
  // Check if user is authorized (booking owner or spot owner)
  if (booking.userId !== req.user.id && booking.Spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  // Check if booking has already started
  const currentDate = new Date();
  if (new Date(booking.startDate) <= currentDate) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 403
    });
  }
  
  await booking.destroy();
  
  return res.json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});

module.exports = router;