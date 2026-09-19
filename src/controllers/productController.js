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

async function createProduct(request, response, next) {
    try {
        const product = await productModel.create(request.body);
        response.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

async function updateProduct(request, response, next) {
    try {
        const existing = await productModel.findById(request.params.id);
        if (!existing) {
            return response.status(404).json({ error: 'Producto no encontrado.' });
        }
        const product = await productModel.update(request.params.id, request.body);
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

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
