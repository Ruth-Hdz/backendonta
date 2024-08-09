const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Crear un nuevo artículo
router.post('/create', articleController.create);

// Obtener todos los artículos del usuario
router.get('/list', articleController.getAll);

// Obtener un artículo por ID
router.get('/:id', articleController.getById);

// Actualizar un artículo por ID
router.put('/:id', articleController.update);

// Eliminar un artículo por ID
router.delete('/:id', articleController.delete);

module.exports = router;
