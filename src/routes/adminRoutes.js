const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta protegida para obtener las visitas
router.get('/visitors', authMiddleware, async (req, res) => {
    try {
        // Asegúrate de cambiar 'visitas' por el nombre real de tu tabla en MySQL si se llama diferente
        const [rows] = await pool.query('SELECT COUNT(*) as totalVisits FROM visitas');
        const totalVisits = rows[0].totalVisits || 0;

        res.json({ totalVisits });
    } catch (error) {
        console.error('Error al obtener visitas:', error);
        res.status(500).json({ error: 'Error al obtener el registro de visitas' });
    }
});

module.exports = router;