const db = require('../config/db');

class Article {
  static create({ titulo, texto, prioridad, id_categoria, id_usuario }, callback) {
    const sql = 'INSERT INTO Articulo (titulo, texto, prioridad, id_categoria, id_usuario) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [titulo, texto, prioridad, id_categoria, id_usuario], callback);
  }

  static findAll(callback) {
    const sql = 'SELECT * FROM Articulo'; // Ajusta la consulta si no necesitas filtrar por id_usuario
    db.query(sql, [], callback);
  }

  static findById(id, id_usuario, callback) {
    const sql = 'SELECT * FROM Articulo WHERE id = ?';
    db.query(sql, [id], callback);
  }

  static update(id, { titulo, texto, prioridad }, id_usuario, callback) {
    const sql = 'UPDATE Articulo SET titulo = ?, texto = ?, prioridad = ? WHERE id = ? AND (id_usuario = ? OR id_usuario IS NULL)';
    console.log('Ejecutando consulta:', sql, 'con parámetros:', [titulo, texto, prioridad, id, id_usuario]);
    db.query(sql, [titulo, texto, prioridad, id, id_usuario], (err, result) => {
      if (err) {
        console.error('Error en update:', err);
      } else {
        console.log('Resultado de update:', result);
      }
      callback(err, result);
    });
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM Articulo WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Article;
