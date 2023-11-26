const mysql = require('mysql2');
require('dotenv').config();

function connectToDatabase() {
  const db = mysql.createConnection({
    host: 'kimdb.clhgz7gmuaob.ap-southeast-2.rds.amazonaws.com',
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: 'wordspicker',
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
  });
  return db;
}

module.exports = connectToDatabase;