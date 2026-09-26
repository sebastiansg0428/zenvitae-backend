const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();

const allowedOrigins = [
    'https://lucent-vacherin-8e5f9f.netlify.app',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
];

// LÍNEA CLAVE: Hacer que la carpeta 'uploads' sea accesible públicamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Origen no permitido por CORS.'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());

app.get('/api/health', async (request, response) => {
    try {
        await pool.query('SELECT 1');
        response.status(200).json({ status: 'ok', db: 'connected' });
    } catch (error) {
        console.error('Error de conexión a la base de datos en /api/health:', error);
        response.status(503).json({ status: 'ok', db: 'disconnected' });
    }
});

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/assistant', assistantRoutes);

app.use(errorHandler);

module.exports = app;