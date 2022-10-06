const db = require('../config/db');
const bcrypt = require('bcrypt');
const ResultInfos = require('./resultInfo');
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (jsonObject) => {
  return jwt.sign( jsonObject, process.env.PASSPHRASE, {
    expiresIn: maxAge,
  });
};

const usersModel = {
    /* This is the route for create new User, is useful for create account */
    async signup(pseudo, password, email) {
        const queryUserExist = `SELECT * FROM users 
                                WHERE pseudo=$1 OR email=$2`;
        const resultUserExist = await db.query(queryUserExist,[pseudo,email]);

        if(resultUserExist.rows[0]){
            const resultInfo = new ResultInfos(false,409,'Username Or Email adress is already used.', null);   
            return resultInfo.getInfos();
        }else{
            const hash = bcrypt.hashSync(password, 10);
            const query = `INSERT INTO "users" (pseudo,password,email) 
                            VALUES ($1, $2,$3) 
                            RETURNING *`;
            const result = await db.query(query, [pseudo,hash,email] );
            delete result.rows[0].password;

            if (result.rowCount === 0) {
                const resultInfo = new ResultInfos(false,400,'Can\'t insert.', null);   
                return resultInfo.getInfos();
            }else{
                const resultInfo = new ResultInfos(true,201,'Success to create account.', result.rows[0]);
                return resultInfo.getInfos();
            }
        }
    },

    /* This is the route for loggin, is useful for identify user */
    async login(pseudo, password) {
        const query = `SELECT users.id, pseudo, password, email, roles.name AS role
                        FROM users
                        JOIN roles ON roles.id = role_id 
                        WHERE pseudo=$1 OR email=$1`;
        const result = await db.query(query, [pseudo] );
        let deCrypt = false;
        
        if(result.rowCount && result.rows[0].password){
            deCrypt = await bcrypt.compare(password, result.rows[0].password);// expect true or false
            delete result.rows[0].password;
        }
       

        if (result.rowCount === 0 || !deCrypt) {
            const resultInfo = new ResultInfos(false,404,'Identification doesn\'t match', null);   
            return resultInfo.getInfos();
        }else{
            const resultInfo = new ResultInfos(true,200,'Success to login.', {token: createToken(result.rows[0])});
            return resultInfo.getInfos();
        }

    },

    /* This is route for search the user by the id  */    
     async getOneByPk(id) {
        console.log(id)
        const query = `SELECT users.id, pseudo, password, email, roles.name AS role
                        FROM users
                        JOIN roles ON roles.id = role_id 
                        WHERE users.id = $1`;
        const result = await db.query(query, [id]);
        console.log(result.rows)
        if(result.rowCount != 0){   
            delete result.rows[0].password;
        }
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos();
        }else{
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },
    /* This is route for get all user  */    
    async getAll() {
        const query = `SELECT pseudo, email, roles.name 
                        FROM users
                        JOIN roles ON roles.id = role_id`
        const result = await db.query(query);
        result.rows.forEach(user => { delete user.password });

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos(); 
        }else{
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows);
            return resultInfo.getInfos();
        }
    },

    /* This is route for update user  */    
    async update(pseudo, password, email, id) {
        if(!pseudo== "" ||  !email == "" ) {
            
            const queryVerify = `SELECT *
                                    FROM users
                                    WHERE users.pseudo=$1 OR users.email=$2`;
                                    
            const resultVerify = await db.query(queryVerify, [pseudo,email]);
            if(resultVerify.rowCount >= 1){
                const resultInfo = new ResultInfos(false,400,'Can\'t update. Email/Username Already exist', null);   
                return resultInfo.getInfos();
            } 
        }
        
        let result1 = null;
        if(!pseudo== "") {
            const newPseudo = `UPDATE users SET pseudo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
            const result = await db.query(newPseudo,[pseudo, id]); 
            result1 = result;
        }
          
        if(!password == "") {
            const hash = bcrypt.hashSync(password, 10);
            const newPassword = `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING * `
            const result = await db.query(newPassword,[hash, id]);
           result1 = result;
        } 
      
          if(!email == "") {
              const newEmail = `UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
              const result = await db.query(newEmail,[email, id]);
              result1 = result;
          }
            const query = `SELECT users.id, pseudo, password, email, roles.name AS role
            FROM users
            JOIN roles ON roles.id = role_id 
            WHERE users.id=$1`;
            const result = await db.query(query, [id] );
            const resultInfo = new ResultInfos(true,200,'User updated.', {token: createToken(result.rows[0])});
            return resultInfo.getInfos();
        // const queryVerify = `SELECT *
        //                         FROM users
        //                         WHERE users.pseudo=$1 OR users.email=$2 AND users.id NOT IN ($3)`;
                                
        // const resultVerify = await db.query(queryVerify, [pseudo,email,id]);
        
        // if(resultVerify.rowCount != 0){
        //     const resultInfo = new ResultInfos(false,400,'Can\'t update. Email/Username Already exist', null);   
        //     return resultInfo.getInfos();    
        // }
        // const hash = bcrypt.hashSync(password, 10);
        // const query = `UPDATE users 
        //                 SET pseudo = $1, password = $2, email = $3 
        //                 WHERE id = $4 
        //                 RETURNING *`
        // const result = await db.query(query,[pseudo, hash, email, id]);
        // delete result.rows[0].password;

        // if (result.rowCount === 0) {
        //     const resultInfo = new ResultInfos(false,400,'Can\'t update.', result);   
        //     return resultInfo.getInfos();
        // }else{
        //     const resultInfo = new ResultInfos(true,200,'User updated.', result.rows);
        //     return resultInfo.getInfos();
        // }

        
    },

    /* This is route for delete user  */    
     async delete(id) {
        const resultExist = await usersModel.getOneByPk(id);
        console.log('resultexist', resultExist);
        if (!resultExist.queryStatus) {
            const resultInfo = new ResultInfos(false,404,'This User does not exists.', result.rows);
            return resultInfo.getInfos();
        }
        const query = `DELETE FROM users 
                        WHERE id = $1 
                        RETURNING *`;
        const result = await db.query(query, [id]);

        const resultInfo = new ResultInfos(true,200,'User deleted.', result);
        return resultInfo.getInfos();
    },




};
/*

switch (pseudo,password,email,id) {
  case pseudo:
    const newPseudo = UPDATE users SET pseudo = $1 WHERE id = $4
    const result = await db.query(newPseudo,[pseudo, id]);
    
  case password:
    const hash = bcrypt.hashSync(password, 10);
    const newPassword = UPDATE users SET password = $2 WHERE id = $4
    const result = await db.query(newPassword,[hash, id]);
    delete result.rows[0].password;

    case email:
    
    const newEmail = UPDATE users SET email = $3 WHERE id = $4
    const result = await db.query(newEmail,[email, id]);
    [break;]
*/

/* si suppression d'un utilisateur il faut changer ces reponses ($1 la personne qui sera supprimer)

UPDATE answers SET user_id = 1
WHERE answers.user_id = $1

Puis supprimer l'utilisateur

DELETE FROM users 
WHERE id = $1 
*/

       
module.exports = usersModel;