const Category = require('../models/Category');

exports.create = (req, res) => {
  const { nombre, icono, color } = req.body;
  const id_usuario = req.userId;

  if (!nombre || !icono || !color) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  Category.create({ nombre, icono, color, id_usuario }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear la categoría', error: err });
    }
    res.status(201).json({ message: 'Categoría creada con éxito', categoryId: result.insertId });
  });
};

exports.getAll = (req, res) => {
  const id_usuario = req.userId;

  Category.findAllByUserId(id_usuario, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las categorías', error: err });
    }
    res.status(200).json(results);
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  // Llamar al modelo para eliminar la categoría
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


