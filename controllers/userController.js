const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Buscar usuario por email
    const user = await new Promise((resolve, reject) => {
      User.findByEmail(email, (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña antigua incorrecta' });
    }

    // Actualizar contraseña
    await new Promise((resolve, reject) => {
      User.updatePassword(user.id, newPassword, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error en el controlador de cambio de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
