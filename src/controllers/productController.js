const productModel = require('../models/productModel');

// Controlador para obtener todos los productos de la base de datos
async function getProducts(req, res) {
    try {
        const products = await productModel.findAll(); // <--- Aquí consulta tu base de datos MySQL
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
    }
}

// Controlador para obtener un producto por ID
async function getProductById(req, res) {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
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