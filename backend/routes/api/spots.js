// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');

// Authentication removed for simplified deployment
const { Spot, Review, User, Booking, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validate spot creation/update
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

// Validate review creation
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

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

// Get all spots
router.get('/', async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  
  // Pagination
  page = parseInt(page) || 1;
  size = parseInt(size) || 20;
  
  if (page < 1) page = 1;
  if (size < 1) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  
  const pagination = {
    limit: size,
    offset: size * (page - 1)
  };
  
  // Filtering
  const where = {};
  
  if (minLat && maxLat) {
    where.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
  } else if (minLat) {
    where.lat = { [Op.gte]: parseFloat(minLat) };
  } else if (maxLat) {
    where.lat = { [Op.lte]: parseFloat(maxLat) };
  }
  
  if (minLng && maxLng) {
    where.lng = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
  } else if (minLng) {
    where.lng = { [Op.gte]: parseFloat(minLng) };
  } else if (maxLng) {
    where.lng = { [Op.lte]: parseFloat(maxLng) };
  }
  
  if (minPrice && maxPrice) {
    where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
  } else if (minPrice) {
    where.price = { [Op.gte]: parseFloat(minPrice) };
  } else if (maxPrice) {
    where.price = { [Op.lte]: parseFloat(maxPrice) };
  }
  
  const spots = await Spot.findAll({
    where,
    ...pagination,
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      }
    ]
  });
  
  const formattedSpots = spots.map(spot => {
    const spotData = spot.toJSON();
    spotData.previewImage = spotData.SpotImages && spotData.SpotImages.length > 0 
      ? spotData.SpotImages[0].url 
      : null;
    delete spotData.SpotImages;
    return spotData;
  });
  
  return res.json({
    Spots: formattedSpots,
    page,
    size
  });
});

// Create a spot
router.post('/', validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  
  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  
  return res.status(201).json(spot);
});

// Get current user's spots
router.get('/current', async (req, res) => {
  const spots = await Spot.findAll({
    where: { ownerId: req.user.id },
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      }
    ],
    attributes: {
      include: [
        [
          Spot.sequelize.fn('ROUND', Spot.sequelize.fn('AVG', Spot.sequelize.col('Reviews.stars')), 1),
          'avgRating'
        ]
      ]
    },
    group: ['Spot.id', 'SpotImage.id']
  });
  
  const formattedSpots = spots.map(spot => {
    const spotData = spot.toJSON();
    spotData.previewImage = spotData.SpotImages && spotData.SpotImages.length > 0 
      ? spotData.SpotImages[0].url 
      : null;
    delete spotData.SpotImages;
    return spotData;
  });
  
  return res.json({ Spots: formattedSpots });
});

// Get details of a spot by ID
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    attributes: {
      include: [
        [
          Spot.sequelize.fn('COUNT', Spot.sequelize.col('Reviews.id')),
          'numReviews'
        ],
        [
          Spot.sequelize.fn('ROUND', Spot.sequelize.fn('AVG', Spot.sequelize.col('Reviews.stars')), 1),
          'avgStarRating'
        ]
      ]
    },
    group: ['Spot.id', 'SpotImages.id', 'Owner.id']
  });
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  return res.json(spot);
});

// Edit a spot
router.put('/:spotId', validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  
  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  
  return res.json(spot);
});

// Delete a spot
router.delete('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  await spot.destroy();
  
  return res.json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});

// Create a review for a spot
router.post('/:spotId/reviews', validateReview, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  // Check if user already has a review for this spot
  const existingReview = await Review.findOne({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id
    }
  });
  
  if (existingReview) {
    return res.status(403).json({
      message: 'User already has a review for this spot',
      statusCode: 403
    });
  }
  
  const { review, stars } = req.body;
  
  const newReview = await Review.create({
    userId: req.user.id,
    spotId: parseInt(req.params.spotId),
    review,
    stars
  });
  
  return res.status(201).json(newReview);
});

// Get all reviews for a spot
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Image,
        as: 'ReviewImages',
        attributes: ['id', 'url']
      }
    ]
  });
  
  return res.json({ Reviews: reviews });
});

// Create a booking for a spot
router.post('/:spotId/bookings', validateBooking, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  if (spot.ownerId === req.user.id) {
    return res.status(403).json({
      message: 'Spot owner cannot book their own spot',
      statusCode: 403
    });
  }
  
  const { startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check for booking conflicts
  const conflictingBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
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
  
  const booking = await Booking.create({
    spotId: parseInt(req.params.spotId),
    userId: req.user.id,
    startDate,
    endDate
  });
  
  return res.json(booking);
});

// Get all bookings for a spot
router.get('/:spotId/bookings', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  
  // Different response based on if user is owner or not
  if (spot.ownerId === req.user.id) {
    // Owner sees all booking details
    const bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    
    return res.json({ Bookings: bookings });
  } else {
    // Non-owners see limited booking details
    const bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: ['spotId', 'startDate', 'endDate']
    });
    
    return res.json({ Bookings: bookings });
  }
});

module.exports = router;