const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Publica: no requiere iniciar sesion.
router.post('/visitors', async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO visitas (createdAt) VALUES (NOW())'
        );

        res.status(201).json({
            message: 'Visita registrada',
        });
    } catch (error) {
        console.error('Error al registrar visita:', error);

        res.status(500).json({
            error: 'No se pudo registrar la visita',
        });
    }
});

module.exports = router;
