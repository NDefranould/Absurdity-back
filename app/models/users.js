const db = require('../config/db');

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

        return result.rows[0];
    },
    /* This is the route for loggin, is useful for identify user */
    async findByPseudoOrEmail(pseudo, password) {
        const result = await db.query(`SELECT users.id, pseudo, password, email, roles.name AS role
                                        FROM users
                                        JOIN roles ON roles.id = role_id 
                                        WHERE pseudo=$1 OR email=$1;`, [pseudo] );
        if(result){
            if(result.rows[0].password === password){
                delete result.rows[0].password;
                return result.rows[0];
            }
        }else{
            return 'Les Pseudo/Email ou Password ne correspondent pas !!';
        }
    },
    /* This is the route for create new User, is useful for create account */
    async create(pseudo, password, email) {
        const result = await db.query(`INSERT INTO "users" (pseudo,password,email) VALUES ($1, $2,$3)`,  [pseudo,password,email] );
        
        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];

    }
};
/* commande sql pour récupérer le role (admin ou utilisateur)
 SELECT users.id, pseudo, password, email, roles.name FROM users
 JOIN roles ON roles.id = role_id
 WHERE pseudo = 'romain' or email = 'romain@romain.com'
*/

       
module.exports = usersModel;