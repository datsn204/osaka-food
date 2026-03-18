const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// THỐNG KÊ TỔNG QUAN
const getStatistics = async (req, res, next) => {
  try {
    const [[{ total_orders }]] = await pool.query(
      'SELECT COUNT(*) AS total_orders FROM orders'
    );
    const [[{ total_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(total_price), 0) AS total_revenue FROM orders WHERE status = 'completed'"
    );
    const [[{ total_users }]] = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'"
    );
    const [[{ total_products }]] = await pool.query(
      'SELECT COUNT(*) AS total_products FROM products'
    );
    const [[{ total_stores }]] = await pool.query(
      'SELECT COUNT(*) AS total_stores FROM stores'
    );

    const [ordersByStatus] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM orders GROUP BY status'
    );

    const [recentOrders] = await pool.query(`
      SELECT o.id, o.total_price, o.status, o.created_at,
             u.name AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const [topProducts] = await pool.query(`
      SELECT p.name, p.image,
             SUM(oi.quantity) AS total_sold,
             SUM(oi.quantity * oi.price) AS revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY oi.product_id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    sendSuccess(res, {
      summary: {
        total_orders,
        total_revenue,
        total_users,
        total_products,
        total_stores
      },
      orders_by_status: ordersByStatus,
      recent_orders: recentOrders,
      top_products: topProducts,
    });
  } catch (err) { next(err); }
};

// DANH SÁCH USER
const getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );
    sendSuccess(res, users);
  } catch (err) { next(err); }
};

// XOÁ USER
const deleteUser = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      'SELECT id, role FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!existing.length) return sendError(res, 'Không tìm thấy user', 404);
    if (existing[0].role === 'admin') {
      return sendError(res, 'Không thể xoá tài khoản admin', 403);
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    sendSuccess(res, null, 'Xoá user thành công');
  } catch (err) { next(err); }
};

module.exports = { getStatistics, getUsers, deleteUser };

