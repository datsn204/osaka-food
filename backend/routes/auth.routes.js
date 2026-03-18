const router = require('express').Router();

const authController = require('../controllers/auth.controller');
console.log('auth controller:', authController);

const { register, login, getMe } = authController;
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;