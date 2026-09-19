const pool = require('../config/db');

async function findAll() {
    const [rows] = await pool.query(
        'SELECT id, name, category, category_label AS categoryLabel, description, price, in_stock AS inStock, image FROM products ORDER BY id'
    );
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT id, name, category, category_label AS categoryLabel, description, price, in_stock AS inStock, image FROM products WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

async function create(product) {
    const { name, category, categoryLabel, description, price, inStock, image } = product;
    const [result] = await pool.query(
        'INSERT INTO products (name, category, category_label, description, price, in_stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, category, categoryLabel, description, price, inStock, image]
    );
    return findById(result.insertId);
}

async function update(id, product) {
    const { name, category, categoryLabel, description, price, inStock, image } = product;
    await pool.query(
        'UPDATE products SET name = ?, category = ?, category_label = ?, description = ?, price = ?, in_stock = ?, image = ? WHERE id = ?',
        [name, category, categoryLabel, description, price, inStock, image, id]
    );
    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
