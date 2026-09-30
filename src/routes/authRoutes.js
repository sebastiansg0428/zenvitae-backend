const express = require('express');
const authController = require('../controllers/authController');
const validateLogin = require('../middlewares/validateLogin');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Política de administrador único: no existe ruta de registro, solo login.
router.post('/login', validateLogin, authController.login);

// Nota: Si el registro está bloqueado por seguridad, puedes dejar o quitar esta línea según tu lógica
router.post('/register', authMiddleware, validateLogin, authController.register);

module.exports = router;