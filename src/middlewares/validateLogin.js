function validateLogin(request, response, next) {
    const { email, password } = request.body;
    const errors = [];

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('El campo "email" es obligatorio y debe ser un correo válido.');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push('El campo "password" es obligatorio y debe tener al menos 6 caracteres.');
    }

    if (errors.length > 0) {
        return response.status(400).json({ error: 'Datos inválidos', details: errors });
    }

    next();
}

module.exports = validateLogin;
