function validateProduct(request, response, next) {
    let { name, category, categoryLabel, price, inStock } = request.body;

    // 1. Convertir el precio a número si viene como string desde FormData
    if (price !== undefined && price !== '') {
        request.body.price = Number(price);
        price = request.body.price;
    }

    // 2. Convertir inStock a booleano ('true', 'false', 'on' o booleanos reales)
    if (inStock !== undefined) {
        if (inStock === 'true' || inStock === true || inStock === 'on') {
            request.body.inStock = true;
        } else if (inStock === 'false' || inStock === false || inStock === '') {
            request.body.inStock = false;
        }
        inStock = request.body.inStock;
    }

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
    if (price === undefined || isNaN(price) || typeof price !== 'number' || price < 0) {
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