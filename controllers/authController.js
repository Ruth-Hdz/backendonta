const db = require('../config/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const saltRounds = 10;
const secret = process.env.SECRET_KEY;

// Registrar un nuevo usuario
exports.register = (req, res) => {
  const { nombre, email, contraseña, acepta_terminos } = req.body;

  if (!nombre || !email || !contraseña || acepta_terminos === undefined) {
    res.status(400).send('Todos los campos son requeridos');
    return;
  }

  const hashedPassword = bcrypt.hashSync(contraseña, saltRounds);

  const query = 'INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, email, hashedPassword, acepta_terminos], (err, result) => {
    if (err) {
      res.status(500).send('Error al registrar el usuario');
      return;
    }
    res.status(201).send('Usuario registrado con éxito');
  });
};

// Iniciar sesión
exports.login = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Por favor, rellene todos los campos' });
  }

  const query = 'SELECT * FROM Usuario WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];

    bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor', error: err });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }

      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token: token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        }
      });
    });
  });
};

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(401).json({ message: 'Token inválido', error: err.message });
    }

    req.userId = decoded.id;
    next();
  });
};



// Cambiar la contraseña del usuario
exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Por favor, rellene todos los campos' });
  }

  const query = 'SELECT * FROM Usuario WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar la contraseña antigua
    bcrypt.compare(oldPassword, user.contraseña, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor', error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña antigua incorrecta' });
      }

      // Hash de la nueva contraseña
      const hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);

      // Actualizar la contraseña en la base de datos
      const updateQuery = 'UPDATE Usuario SET contraseña = ? WHERE id = ?';
      db.query(updateQuery, [hashedNewPassword, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error al actualizar la contraseña', error: err });
        }
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
      });
    });
  });
};
