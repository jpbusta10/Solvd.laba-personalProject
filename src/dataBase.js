const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'db',
  database: 'finInstitution',
  password: 'root',
  port: "http://db:5432", 
});

module.exports = pool;
