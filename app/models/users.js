const db = require('../config/db');

const usersModel = {

      
     async findByPk(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
    },

    async create(pseudo, password, email) {


        const result = await db.query(`INSERT INTO "users" (pseudo,password,email) VALUES ($1, $2,$3)`,  [pseudo,password,email] );
        
        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];

    }
};

       
module.exports = usersModel;