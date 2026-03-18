const router = require('express').Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET /api/products - all
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products - admin + upload
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);

// PUT /api/products/:id
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);

// DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

