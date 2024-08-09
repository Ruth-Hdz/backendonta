const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware'); // Verifica que esta ruta sea correcta

// Crear un nuevo artículo (requiere autenticación)
router.post('/create', authMiddleware.authenticate, articleController.create);

// Obtener todos los artículos del usuario (requiere autenticación)
router.get('/list', authMiddleware.authenticate, articleController.getAll);

// Obtener un artículo por ID (requiere autenticación)
router.get('/:id', authMiddleware.authenticate, articleController.getById);

// Actualizar un artículo por ID (requiere autenticación)
router.put('/:id', authMiddleware.authenticate, articleController.update);

// Eliminar un artículo por ID (requiere autenticación)
router.delete('/:id', authMiddleware.authenticate, articleController.delete);

module.exports = router;
