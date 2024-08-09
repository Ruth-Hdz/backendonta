const Article = require('../models/Article');

// Crear un nuevo artículo
exports.create = (req, res) => {
  const { title, content } = req.body;
  const id_usuario = req.userId; // O null si no se usa autenticación

  if (!title || !content) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  Article.create({ title, content, id_usuario }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el artículo', error: err });
    }
    res.status(201).json({ message: 'Artículo creado con éxito', articleId: result.insertId });
  });
};

// Obtener todos los artículos del usuario
exports.getAll = (req, res) => {
  // id_usuario ya no se usa si no hay autenticación
  Article.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los artículos', error: err });
    }
    res.status(200).json(results);
  });
};

// Obtener un artículo por ID
exports.getById = (req, res) => {
  const { id } = req.params;
  // id_usuario ya no se usa si no hay autenticación
  Article.findById(id, null, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el artículo', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.status(200).json(results[0]);
  });
};

// Actualizar un artículo por ID
exports.update = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  // id_usuario ya no se usa si no hay autenticación

  if (!title || !content) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  Article.update(id, { title, content }, null, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el artículo', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.status(200).json({ message: 'Artículo actualizado con éxito' });
  });
};

// Eliminar un artículo por ID
exports.delete = (req, res) => {
  const { id } = req.params;
  // id_usuario ya no se usa si no hay autenticación

  Article.delete(id, null, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el artículo', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.status(200).json({ message: 'Artículo eliminado con éxito' });
  });
};
