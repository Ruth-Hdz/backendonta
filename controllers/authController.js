const db = require('../config/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const saltRounds = 10;
const secret = process.env.SECRET_KEY;

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  const { nombre, email, contraseña, acepta_terminos, firebase_uid } = req.body;

  if (!nombre || !email || !contraseña || !firebase_uid) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      User.findByEmail(email, (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Create new user
    const newUser = {
      nombre,
      email,
      contraseña: hashedPassword,
      acepta_terminos,
      firebase_uid
    };

    await new Promise((resolve, reject) => {
      User.create(newUser, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el controlador de registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
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

// authController.js
exports.authenticate = (req, res, next) => {
  // Lógica para autenticar al usuario y asignar req.userId
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  // Supongamos que tienes una función para verificar el token
  verifyToken(token, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });

    req.userId = decoded.userId; // Asegúrate de que esta línea esté configurada correctamente
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
