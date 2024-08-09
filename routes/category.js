const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); // Verifica esta ruta
const authController = require('../controllers/authController'); // Verifica esta ruta

router.post('/create', authController.authenticate, categoryController.create);
router.get('/list', authController.authenticate, categoryController.getAll);
router.delete('/delete/:id', authController.authenticate, categoryController.delete);

module.exports = router;
