const { pool } = require('../config/db');

// GET /api/orders - user orders
const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, s.name as store_name 
      FROM orders o 
      JOIN stores s ON o.store_id = s.id 
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, store_id, total_amount, address } = req.body; // items: [{product_id, quantity}]
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, store_id, total_amount, address, status) VALUES (?, ?, ?, ?, "pending")',
        [req.user.id, store_id, total_amount, address]
      );
      const orderId = orderResult.insertId;
      
      // Order items
      for (let item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }
      
      // Clear cart
      await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
      
      await connection.commit();
      res.status(201).json({ success: true, data: { id: orderId } });
    } catch (txError) {
      await connection.rollback();
      throw txError;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder
};

