function validateProduct(request, response, next) {
    const { name, category, categoryLabel, price, inStock } = request.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('El campo "name" es obligatorio y debe ser texto.');
    }
    if (!category || typeof category !== 'string') {
        errors.push('El campo "category" es obligatorio y debe ser texto.');
    }
    if (!categoryLabel || typeof categoryLabel !== 'string') {
        errors.push('El campo "categoryLabel" es obligatorio y debe ser texto.');
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
        errors.push('El campo "price" es obligatorio y debe ser un número mayor o igual a 0.');
    }
    if (inStock !== undefined && typeof inStock !== 'boolean') {
        errors.push('El campo "inStock" debe ser verdadero o falso.');
    }

    if (errors.length > 0) {
        return response.status(400).json({ error: 'Datos inválidos', details: errors });
    }

    next();
}

module.exports = validateProduct;
