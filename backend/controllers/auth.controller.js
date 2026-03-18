const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
console.log("AUTH CONTROLLER START");
// ĐĂNG KÝ
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Vui lòng điền đầy đủ name, email, password', 400);
    }

    // Kiểm tra email đã tồn tại chưa
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return sendError(res, 'Email đã được sử dụng', 409);
    }

    // Mã hoá mật khẩu
    const hashed = await bcrypt.hash(password, 12);

    // Lưu vào DB
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, 'user']
    );

    const token = generateToken(result.insertId);
    sendSuccess(res, {
      token,
      user: { id: result.insertId, name, email, role: 'user' }
    }, 'Đăng ký thành công', 201);

  } catch (err) {
    next(err);
  }
};

// ĐĂNG NHẬP
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Vui lòng điền email và password', 400);
    }

    // Tìm user
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (!rows.length) {
      return sendError(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    const user = rows[0];

    // So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    const token = generateToken(user.id);
    sendSuccess(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 'Đăng nhập thành công');

  } catch (err) {
    next(err);
  }
};

// LẤY THÔNG TIN BẢN THÂN
const getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    sendSuccess(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
