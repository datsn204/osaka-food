const router = require('express').Router();
const {
  getOrders,
  createOrder
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/orders
router.get('/', protect, getOrders);

// POST /api/orders
router.post('/', protect, createOrder);

module.exports = router;

