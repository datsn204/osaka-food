const router = require('express').Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/cart
router.get('/', protect, getCart);

// POST /api/cart/add
router.post('/add', protect, addToCart);

// PUT /api/cart/:id
router.put('/:id', protect, updateCartItem);

// DELETE /api/cart/:id
router.delete('/:id', protect, removeFromCart);

module.exports = router;

