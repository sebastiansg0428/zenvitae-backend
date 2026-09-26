const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateProduct = require('../middlewares/validateProduct');
const upload = require('../middlewares/uploadMiddleware');

// 0. NUEVO: GET (Listar todos los productos públicos)
router.get('/', productController.getProducts);

// 0.1. NUEVO: GET (Obtener un producto por ID, opcional pero útil)
router.get('/:id', productController.getProductById);

// 1. POST (Crear producto): auth -> Multer -> validateProduct -> controlador
router.post(
    '/',
    authMiddleware,
    upload.single('image'),
    validateProduct,
    productController.createProduct // o crearProducto según tu alias
);

// 2. PUT (Actualizar producto):
router.put(
    '/:id',
    authMiddleware,
    upload.single('image'),
    validateProduct,
    productController.updateProduct // o actualizarProducto según tu alias
);

// 3. DELETE (Eliminar producto): auth -> controlador
router.delete(
    '/:id',
    authMiddleware,
    productController.deleteProduct
);

module.exports = router;