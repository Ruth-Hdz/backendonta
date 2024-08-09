const Category = require('../models/Category');

exports.create = (req, res) => {
  const { nombre, icono, color } = req.body;
  // id_usuario ya no se usa
  // const id_usuario = req.userId;

  if (!nombre || !icono || !color) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  Category.create({ nombre, icono, color, id_usuario: null }, (err, result) => { // Cambia `id_usuario` a null
    if (err) {
      return res.status(500).json({ message: 'Error al crear la categoría', error: err });
    }
    res.status(201).json({ message: 'Categoría creada con éxito', categoryId: result.insertId });
  });
};

exports.getAll = (req, res) => {
  // id_usuario ya no se usa
  // const id_usuario = req.userId;

  Category.findAll((err, results) => { // Cambia `findAllByUserId` a `findAll`
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las categorías', error: err });
    }
    res.status(200).json(results);
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Category.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar la categoría', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  });
};

exports.edit = (req, res) => {
  const { id } = req.params;
  const { nombre, icono, color } = req.body;

  // Validar los datos de entrada
  if (!id || !nombre || !icono || !color) {
      return res.status(400).json({ message: 'Faltan parámetros' });
  }

  Category.update(id, { nombre, icono, color }, (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error al actualizar la categoría', error: err });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json({ message: 'Categoría actualizada correctamente' });
  });
};

exports.getAll = (req, res) => {
  Category.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las categorías', error: err });
    }
    res.status(200).json(results);
  });
};