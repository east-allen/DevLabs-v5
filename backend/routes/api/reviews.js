// backend/routes/api/reviews.js
const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validate review creation/update
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

// Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
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

// Add an image to a review
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404
    });
  }
  
  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  // Check if review already has 10 images
  const imageCount = await Image.count({
    where: {
      imageableId: req.params.reviewId,
      imageableType: 'review'
    }
  });
  
  if (imageCount >= 10) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached',
      statusCode: 403
    });
  }
  
  const { url } = req.body;
  
  const image = await Image.create({
    imageableId: parseInt(req.params.reviewId),
    imageableType: 'review',
    url
  });
  
  return res.json({
    id: image.id,
    url: image.url
  });
});

// Edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404
    });
  }
  
  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  const { review: reviewText, stars } = req.body;
  
  await review.update({
    review: reviewText,
    stars
  });
  
  return res.json(review);
});

// Delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404
    });
  }
  
  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden',
      statusCode: 403
    });
  }
  
  await review.destroy();
  
  return res.json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});

module.exports = router;