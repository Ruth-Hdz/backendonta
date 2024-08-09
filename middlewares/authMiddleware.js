const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de que dotenv esté configurado

const secret = process.env.SECRET_KEY;

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
