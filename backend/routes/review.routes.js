const router = require('express').Router();
const {
  getReviews,
  createReview
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/reviews
router.get('/', getReviews);

// POST /api/reviews
router.post('/', protect, createReview);

module.exports = router;

