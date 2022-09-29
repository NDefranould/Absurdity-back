const db = require('../config/db');
const bcrypt = require('bcrypt');

const usersModel = {
    /* This is route for search the user by the id  */    
     async findByPk(id) {
        const result = await db.query(`SELECT users.id, pseudo, password, email, roles.name AS role
                                        FROM users
                                        JOIN roles ON roles.id = role_id 
                                        WHERE users.id = $1`, [id]);

        if (result.rowCount === 0) {
            return undefined;
        }
        delete result.rows[0].password;
        return result.rows[0];
    },

    async findAll() {
        const result = await db.query(`SELECT pseudo, email, roles.name FROM users
                                       JOIN roles ON roles.id = role_id`);
                                       
        if (result.rowCount === 0) {
            return undefined;
        }
        delete result.rows[0].password;
        return result.rows[0];

    },
    /* This is the route for loggin, is useful for identify user */
    async login(pseudo, password) {
        const result = await db.query(`SELECT users.id, pseudo, password, email, roles.name AS role
                                        FROM users
                                        JOIN roles ON roles.id = role_id 
                                        WHERE pseudo=$1 OR email=$1;`, [pseudo] );
                                        
        if(result){
            if(await bcrypt.compare(password, result.rows[0].password)) {
                
                delete result.rows[0].password;
                return result.rows[0];
            }
        }else{
            return 'Les Pseudo/Email ou Password ne correspondent pas !!';
        }
    },
    /* This is the route for create new User, is useful for create account */
    async signup(pseudo, password, email) {
        const query = `SELECT * FROM users WHERE pseudo=$1 OR email=$2`;
        const resultUserExist = await db.query(query,[pseudo,email]);
        if(resultUserExist.rows[0]){
            return 'user or email already exist';
        }else{
        const hash = bcrypt.hashSync(password, 10);
        const result = await db.query(`INSERT INTO "users" (pseudo,password,email) VALUES ($1, $2,$3)`,  [pseudo,hash,email] );
        
        if (result.rowCount === 0) {
            return undefined;
        }

            return 'user created';
        }

    },
     async delete(id) {
        const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
        return !!result.rowCount;
    },

    async update(pseudo, password, email, id) {
        const hash = bcrypt.hashSync(password, 10);
        const savedUser = await db.query( `UPDATE users SET pseudo = $1, password = $2, email = $3 
         WHERE id = $4 RETURNING *`,[pseudo, hash, email, id]
        );
           
        return savedUser.rows[0];
    },


};
/* commande sql pour récupérer le role (admin ou utilisateur)
 SELECT users.id, pseudo, password, email, roles.name FROM users
 JOIN roles ON roles.id = role_id
 WHERE pseudo = 'romain' or email = 'romain@romain.com'
*/

       
module.exports = usersModel;