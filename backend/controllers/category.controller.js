const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// LẤY TẤT CẢ CATEGORIES
const getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT id, name, description FROM categories ORDER BY name'
    );
    sendSuccess(res, categories);
  } catch (err) { next(err); }
};

// TẠO CATEGORY
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return sendError(res, 'Tên category là bắt buộc', 400);

    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    const [cat] = await pool.query(
      'SELECT id, name, description FROM categories WHERE id = ?',
      [result.insertId]
    );
    sendSuccess(res, cat[0], 'Tạo category thành công', 201);
  } catch (err) { next(err); }
};

// CẬP NHẬT CATEGORY
const updateCategory = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );
    if (!existing.length) return sendError(res, 'Không tìm thấy category', 404);

    const { name, description } = req.body;
    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name || existing[0].name, description ?? existing[0].description, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT id, name, description FROM categories WHERE id = ?',
      [req.params.id]
    );
    sendSuccess(res, updated[0], 'Cập nhật category thành công');
  } catch (err) { next(err); }
};

// XOÁ CATEGORY
const deleteCategory = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE id = ?',
      [req.params.id]
    );
    if (!existing.length) return sendError(res, 'Không tìm thấy category', 404);

    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    sendSuccess(res, null, 'Xoá category thành công');
  } catch (err) { next(err); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };