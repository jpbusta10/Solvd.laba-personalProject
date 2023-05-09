const {pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'finInstitution',
    password: 'castelli123',
    port: 5432,
});

module.exports = pool;
