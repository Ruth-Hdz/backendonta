const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const articleRoutes = require('./routes/article');
const userRoutes = require('./routes/user'); // Importar las rutas del usuario
const db = require('./config/db');

// Configurar dotenv para cargar variables de entorno desde un archivo .env
dotenv.config();

// Inicializar la aplicación Express
const app = express();
// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());
app.use(express.json()); // Asegura que Express pueda parsear JSON

// Conectar a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Rutas
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/article', articleRoutes);
app.use('/user', userRoutes); // Usar las rutas del usuario

// Middleware para manejar errores y rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
