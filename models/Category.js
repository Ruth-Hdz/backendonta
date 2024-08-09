// models/Category.js
const db = require('../config/db');

class Category {
  static create({ nombre, icono, color, id_usuario }, callback) {
    const sql = 'INSERT INTO Categoria (nombre, icono, color, id_usuario) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, icono, color, id_usuario], callback);
  }

  static findAllByUserId(id_usuario, callback) {
    const sql = 'SELECT * FROM Categoria WHERE id_usuario = ?';
    db.query(sql, [id_usuario], callback);
  }

  static findById(id, id_usuario, callback) {
    const sql = 'SELECT * FROM Categoria WHERE id = ? AND id_usuario = ?';
    db.query(sql, [id, id_usuario], callback);
  }

  static update(id, { nombre, icono, color }, id_usuario, callback) {
    const sql = 'UPDATE Categoria SET nombre = ?, icono = ?, color = ? WHERE id = ? AND id_usuario = ?';
    db.query(sql, [nombre, icono, color, id, id_usuario], callback);
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM Categoria WHERE id = ?';
    db.query(sql, [id], callback);
  }
   
}

module.exports = Category;
