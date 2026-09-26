const productModel = require('../models/productModel');

async function getProducts(request, response, next) {
    try {
        const products = await productModel.findAll();
        response.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

async function getProductById(request, response, next) {
    try {
        const product = await productModel.findById(request.params.id);
        if (!product) {
            return response.status(404).json({ error: 'Producto no encontrado.' });
        }
        response.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

// Actualizado para capturar el archivo de Multer (req.file)
async function createProduct(request, response, next) {
    try {
        // Preparamos los datos del cuerpo de la petición
        const productData = { ...request.body };

        // Si Multer guardó una imagen local, añadimos su ruta al objeto que va a la base de datos
        if (request.file) {
            productData.image = `/uploads/${request.file.filename}`;
        }

        const product = await productModel.create(productData);
        response.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

// Actualizado para la edición con opción a nueva imagen
async function updateProduct(request, response, next) {
    try {
        const existing = await productModel.findById(request.params.id);
        if (!existing) {
            return response.status(404).json({ error: 'Producto no encontrado.' });
        }

        const productData = { ...request.body };

        // Si el usuario subió una nueva imagen al editar, actualizamos la ruta
        if (request.file) {
            productData.image = `/uploads/${request.file.filename}`;
        }

        const product = await productModel.update(request.params.id, productData);
        response.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

async function deleteProduct(request, response, next) {
    try {
        const deleted = await productModel.remove(request.params.id);
        if (!deleted) {
            return response.status(404).json({ error: 'Producto no encontrado.' });
        }
        response.status(204).send();
    } catch (error) {
        next(error);
    }
}

// Exportamos usando los nombres en inglés que concuerdan con tus rutas
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Alias en español por si los usas en otro lado, apuntando a las funciones correctas:
    crearProducto: createProduct,
    actualizarProducto: updateProduct,
    eliminarProducto: deleteProduct
};