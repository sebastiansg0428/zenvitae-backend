const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta limpia a la tabla de Administradores
        const [rows] = await pool.query('SELECT * FROM `admins` WHERE `email` = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const admin = rows[0];

        // Verificamos la contraseña encriptada con bcrypt
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Generamos el Token JWT (expira en 8 horas)
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            admin: { id: admin.id, email: admin.email }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const register = async (req, res) => {
    res.status(403).json({ error: 'Registro deshabilitado por política de administrador único' });
};

module.exports = {
    login,
    register
};