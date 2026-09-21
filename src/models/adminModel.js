const pool = require('../config/db');

async function findByEmail(email) {
    const [rows] = await pool.query(
        'SELECT id, email, password_hash AS passwordHash FROM admins WHERE email = ?',
        [email]
    );
    return rows[0] || null;
}

async function countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM admins');
    return rows[0].total;
}

async function create(email, passwordHash) {
    const [result] = await pool.query(
        'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
        [email, passwordHash]
    );
    return { id: result.insertId, email };
}

module.exports = { findByEmail, create, countAll };
