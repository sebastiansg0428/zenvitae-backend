const express = require('express');
const productController = require('../controllers/productController');
const validateProduct = require('../middlewares/validateProduct');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, validateProduct, productController.createProduct);
router.put('/:id', authMiddleware, validateProduct, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
