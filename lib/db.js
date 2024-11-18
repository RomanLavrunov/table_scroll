import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'admin',        
  password: 'password',
  database: 'documents_db', 
});

export const promisePool = pool.promise();
