const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/create', categoryController.create);
router.get('/list', categoryController.getAll);  // Verifica que esta ruta sea correcta
router.delete('/delete/:id', categoryController.delete);
router.put('/edit/:id', categoryController.edit);

module.exports = router;
