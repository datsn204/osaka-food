const router = require('express').Router();
const {
  getStatistics,
  getUsers,
  deleteUser
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/statistics', getStatistics);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
