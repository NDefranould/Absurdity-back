require('dotenv').config();
const { Pool } = require('pg')
const pool = new Pool({ connectionString:process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = {
    originalClient: pool,
    async query(...params) {
    
        return this.originalClient.query(...params);
    },
};



