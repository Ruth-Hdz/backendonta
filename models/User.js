const db = require('../config/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');
const saltRounds = 10;

class User {
  static create({ nombre, email, contraseña, acepta_terminos }, callback) {
    const hashedPassword = bcrypt.hashSync(contraseña, saltRounds);
    const sql = 'INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword, acepta_terminos], callback);
  }

  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM Usuario WHERE email = ?';
    db.query(sql, [email], callback);
  }
  
  static updatePassword(id, newPassword, callback) {
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
    const sql = 'UPDATE Usuario SET contraseña = ? WHERE id = ?';
    db.query(sql, [hashedPassword, id], callback);
  }
}

module.exports = User;
