const db = require('../config/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');
const saltRounds = 10;

class User {
  static create({ nombre, email, contraseña, acepta_terminos, firebase_uid }, callback) {
    const hashedPassword = bcrypt.hashSync(contraseña, saltRounds);
    const sql = 'INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos, firebase_uid) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword, acepta_terminos, firebase_uid], callback);
  }

  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM Usuario WHERE email = ?';
    db.query(sql, [email], callback);
  }

  static findByFirebaseUid(firebase_uid, callback) {
    const sql = 'SELECT * FROM Usuario WHERE firebase_uid = ?';
    db.query(sql, [firebase_uid], callback);
  }
  
  static updatePassword(id, newPassword, callback) {
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
    const sql = 'UPDATE Usuario SET contraseña = ? WHERE id = ?';
    db.query(sql, [hashedPassword, id], callback);
  }

  static updateFirebaseUid(id, firebase_uid, callback) {
    const sql = 'UPDATE Usuario SET firebase_uid = ? WHERE id = ?';
    db.query(sql, [firebase_uid, id], callback);
  }
}

module.exports = User;