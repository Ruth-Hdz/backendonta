const db = require('../config/db');

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ruthhdz',
  password: 'ruthhdz',
  database: 'onta_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

module.exports = connection;
