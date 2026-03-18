const router = require('express').Router();
const {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/store.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET /api/stores  → public
router.get('/', getStores);
router.get('/:id', getStoreById);

// POST/PUT/DELETE → admin + upload
router.post('/', protect, adminOnly, upload.single('image'), createStore);
router.put('/:id', protect, adminOnly, upload.single('image'), updateStore);
router.delete('/:id', protect, adminOnly, deleteStore);

module.exports = router;

