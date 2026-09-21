const express = require('express');
const authController = require('../controllers/authController');
const validateLogin = require('../middlewares/validateLogin');

const router = express.Router();

// Política de administrador único: no existe ruta de registro, solo login.
router.post('/login', validateLogin, authController.login);

module.exports = router;
