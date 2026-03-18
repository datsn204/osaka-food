const { pool } = require('../config/db');
const path = require('path');

// GET /api/stores
const getStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      JOIN users u ON s.user_id = u.id
    `);
    res.json({ success: true, data: stores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stores/:id
const getStoreById = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ?
    `, [req.params.id]);
    
    if (!stores.length) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    res.json({ success: true, data: stores[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/stores
const createStore = async (req, res) => {
  try {
    const { name, description, address, phone, category } = req.body;
    const userId = req.user.id;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const [result] = await pool.query(
      `INSERT INTO stores (name, description, address, phone, category, image_url, user_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, description, address, phone, category, imageUrl, userId]
    );
    
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, image_url: imageUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/stores/:id
const updateStore = async (req, res) => {
  try {
    const { name, description, address, phone, category } = req.body;
    const storeId = req.params.id;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const fields = ['name', 'description', 'address', 'phone', 'category'];
    if (imageUrl) fields.push('image_url');
    
    const values = [name, description, address, phone, category];
    if (imageUrl) values.push(imageUrl);
    values.push(storeId);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const [result] = await pool.query(
      `UPDATE stores SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    res.json({ success: true, message: 'Store updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/stores/:id
const deleteStore = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM stores WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    res.json({ success: true, message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};

