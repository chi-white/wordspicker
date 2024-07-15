const mysql = require('mysql2');
require('dotenv').config();


console.log("from db", process.env.RDS_USER) ;

function connectToDatabase() {
  const pool = mysql.createPool({
    host: 'kimdb.clhgz7gmuaob.ap-southeast-2.rds.amazonaws.com',
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: 'wordspicker',
    waitForConnections: true,
    connectionLimit: 10
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
    if(connection) connection.release() ;
  });
  return pool;
}

module.exports = connectToDatabase;