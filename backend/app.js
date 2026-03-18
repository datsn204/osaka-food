const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// ─── 1. CORS ──────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── 2. Body Parser ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 3. Static Files ──────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── 4. Health Check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Osaka Food API đang chạy 🍡' });
});

// ─── 5. Routes ────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/stores',     require('./routes/store.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/cart',       require('./routes/cart.routes'));
app.use('/api/orders',     require('./routes/order.routes'));
app.use('/api/reviews',    require('./routes/review.routes'));
app.use('/api/admin',      require('./routes/admin.routes'));

// ─── 6. Error Handling ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;