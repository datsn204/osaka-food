const { pool } = require('../config/db');

// GET /api/reviews?product_id=&store_id=
const getReviews = async (req, res) => {
  try {
    const { product_id, store_id } = req.query;
    let query = 'SELECT * FROM reviews WHERE 1=1';
    let params = [];
    
    if (product_id) {
      query += ' AND product_id = ?';
      params.push(product_id);
    }
    if (store_id) {
      query += ' AND store_id = ?';
      params.push(store_id);
    }
    
    const [reviews] = await pool.query(query + ' ORDER BY created_at DESC', params);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { rating, comment, product_id, store_id } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, product_id, store_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, product_id, store_id, rating, comment]
    );
    
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview
};

