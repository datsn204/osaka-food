const { pool } = require('../config/db');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { store_id, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, s.name as store_name 
      FROM products p 
      JOIN stores s ON p.store_id = s.id
      WHERE 1=1
    `;
    let params = [];
    
    if (store_id) {
      query += ' AND p.store_id = ?';
      params.push(store_id);
    }
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [products] = await pool.query(query, params);
    const [total] = await pool.query('SELECT COUNT(*) as count FROM products WHERE 1=1' + (params.slice(0,-2).length ? params.slice(0,-2).map(() => ' ?').join(' AND ') : ''), params.slice(0,-2));
    
    res.json({ 
      success: true, 
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total[0].count }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      JOIN stores s ON p.store_id = s.id 
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, store_id } = req.body;
    
    let images = [];
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, category, store_id, images, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, description, parseFloat(price), category, parseInt(store_id), JSON.stringify(images)]
    );
    
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, images } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, store_id } = req.body;
    const productId = req.params.id;
    
    let images = [];
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    const [result] = await pool.query(
      `UPDATE products SET name=?, description=?, price=?, category=?, store_id=?, images=? WHERE id=?`,
      [name, description, parseFloat(price), category, parseInt(store_id), JSON.stringify(images), productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

