const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'finInstitution',
  password: 'root',
  port: 5432, 
});

module.exports = pool;
