 
const db = require('../config/db');

class Article {
  static create({ titulo, texto, prioridad, id_categoria, id_usuario }, callback) {
    const sql = 'INSERT INTO Articulo (titulo, texto, prioridad, id_categoria, id_usuario) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [titulo, texto, prioridad, id_categoria, id_usuario], callback);
  }

  static findAllByCategoryId(id_categoria, callback) {
    const sql = 'SELECT * FROM Articulo WHERE id_categoria = ?';
    db.query(sql, [id_categoria], callback);
  }
}

module.exports = Article;
