const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

async function login(request, response, next) {
    try {
        const { email, password } = request.body;

        const admin = await adminModel.findByEmail(email);
        if (!admin) {
            return response.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
        if (!passwordMatches) {
            return response.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = jwt.sign(
            { sub: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        response.status(200).json({ token });
    } catch (error) {
        next(error);
    }
}

module.exports = { login };
