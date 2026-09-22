require('dotenv').config();
const mysql = require('mysql2/promise');

// Railway inyecta MYSQLHOST/MYSQLUSER/etc. al enlazar el servicio de MySQL; DB_* sigue disponible para desarrollo local.
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    port: process.env.MYSQLPORT || process.env.DB_PORT,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;
