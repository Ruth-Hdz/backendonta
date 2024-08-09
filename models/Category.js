const db = require('../config/db');

class Category {
  static create({ nombre, icono, color, id_usuario }, callback) {
    const sql = 'INSERT INTO Categoria (nombre, icono, color, id_usuario) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, icono, color, id_usuario], callback);
  }

  static findAll(callback) {
    const sql = 'SELECT * FROM Categoria'; // Ajusta la consulta si no necesitas filtrar por id_usuario
    db.query(sql, [], callback);
  }
 
  static update(id, { nombre, icono, color }, callback) {
    const sql = 'UPDATE Categoria SET nombre = ?, icono = ?, color = ? WHERE id = ?';
    db.query(sql, [nombre, icono, color, id], callback);
  }
  
  static delete(id, callback) {
    const sql = 'DELETE FROM Categoria WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Category;
