const jwt = require('jsonwebtoken');

function authMiddleware(request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ error: 'Token de autenticación no proporcionado.' });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        request.admin = { id: payload.sub, email: payload.email };
        next();
    } catch (error) {
        return response.status(401).json({ error: 'Token inválido o expirado.' });
    }
}

module.exports = authMiddleware;
