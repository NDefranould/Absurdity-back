const db = require('../config/db');
const bcrypt = require('bcrypt');
const ResultInfos = require('./resultInfo');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (jsonObject) => {
  return jwt.sign( jsonObject, process.env.PASSPHRASE, {
    expiresIn: maxAge,
  });
};

async function sendEmail(email, subject ,text){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nicolasdefranould@gmail.com",
            pass: "ljjlpdztfpuysxra"
        }
    });
    const info = await transporter.sendMail({
        from: "nicolasdefranould@gmail.com", 
        to: email,  
        subject: subject, 
        text: text,
        
      });
}

const usersModel = {

    /*This the function for create new User, is useful for create account*/
    async signup(pseudo, password, email) {

        /*The query sql for verify if pseudo or email exist already*/
        const queryUserExist = `SELECT * FROM users 
                                WHERE pseudo=$1 OR email=$2`;
        const resultUserExist = await db.query(queryUserExist,[pseudo,email]);

        /*if the query have find pseudo or email exist already send 409*/
        if(resultUserExist.rows[0]){
            const resultInfo = new ResultInfos(false,409,'Username Or Email adress is already used.', null);   
            return resultInfo.getInfos();
        }else{
        /*else hash password*/
            const hash = bcrypt.hashSync(password, 10);

        /*The query sql for add in database pseudo, password and email*/
        const query = `INSERT INTO "users" (pseudo,password,email) 
                       VALUES ($1, $2,$3) 
                       RETURNING *`;
        const result = await db.query(query, [pseudo,hash,email] );
        
        /*delete the password in the result*/
        delete result.rows[0].password;
        const id = result.rows[0].id    

        /*if have problem with database send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,400,'Can\'t insert.', null);   
            return resultInfo.getInfos();
        }else{
        /*else send 201*/
            //FOR ADD EMAIL VERIFICATION DECOMMENT
            usersModel.sendVerifyEmail(id);
            const resultInfo = new ResultInfos(true,201,'Success to create account.', result.rows[0]);
            return resultInfo.getInfos();
            }
        }
    },
    async sendVerifyEmail(id) {
         
        const query = `SELECT * FROM users 
                       WHERE users.id = $1`;                 
        const result = await db.query(query, [id]);
        const email = await result.rows[0].email;
        delete result.rows[0].password;
        console.log(result.rows[0])
        const token = createToken(result.rows[0]);

        const subject = "Confirmation inscription"
        const text = `Bonjour,

        Vous venez de créer un compte sur le site d'Absurdity, merci de confirmer votre adresse email en cliquant sur le lien ci-dessous.

         https://absurdity.vercel.app/emailverify?token=${token}
         
         Merci.
         Cordialement,
         L'équipe d'Absurdity
         www.absurdity.vercel.app
         `;

        await sendEmail(email,subject,text);

        /*else send 200*/
        const resultInfo = new ResultInfos(true,200,'Success to send email confirmation.', result);
        return resultInfo.getInfos();
    },
    async verifyEmail(dataToken) {
        //here we have to create function to verify email with token               
        const query = `SELECT * FROM users 
                       WHERE users.id = $1`;                 
        const result = await db.query(query, [dataToken.id]);
        delete result.rows[0].password;

        if(result.rowCount === 0){
            const resultInfo = new ResultInfos(false,404,'User not found.', result);
            return resultInfo.getInfos();
        };
        if(result.rows[0].pseudo === dataToken.pseudo && result.rows[0].email === dataToken.email){
            // if token = okay set email_verify to true
            const query0 = `UPDATE users SET email_verify = '1'
            WHERE users.id = $1 RETURNING *`;                 
            const result0 = await db.query(query0, [dataToken.id]);
            /*else send 200*/
            const resultInfo = new ResultInfos(true,200,'Success to verify account.', result0);
            return resultInfo.getInfos();
        }else{
            /*else send 200*/
            const resultInfo = new ResultInfos(false,400,'Error to verify.', {});
            return resultInfo.getInfos();
        }

    },
    /* This function for loggin, is useful for identify user */
    async login(pseudo, password) {

        /*The query sql for login with pseudo or email*/
        const query = `SELECT users.id, pseudo, password, email, roles.name AS role
                        FROM users
                        JOIN roles ON roles.id = role_id 
                        WHERE email_verify=true AND pseudo=$1 OR email=$1`;
        const result = await db.query(query, [pseudo] );
        let deCrypt = false;
        /*if retrieved the pseudo or email and the password in database*/
        if(result.rowCount && result.rows[0].password){
        /*compare the password hash in the database with that the user have enter */
            deCrypt = await bcrypt.compare(password, result.rows[0].password);// expect true or false
        /*delete the password in the result*/
            delete result.rows[0].password;
        }
        /*if the pseudo or email or the password are incorrect sends 404*/
        if (result.rowCount === 0 || !deCrypt) {
            const resultInfo = new ResultInfos(false,404,'Identification doesn\'t match', null);   
            return resultInfo.getInfos();
        }else{
        /*else send 200*/
            const resultInfo = new ResultInfos(true,200,'Success to login.', {token: createToken(result.rows[0])});
            return resultInfo.getInfos();
        }

    },

    /*The function for search the user by the id*/    
    async getOneByPk(id) {

        /*The query sql for searching one user by id*/
        const query = `SELECT users.id, pseudo, password, email, roles.name AS role
                       FROM users
                       JOIN roles ON roles.id = role_id 
                       WHERE users.id = $1`;
        const result = await db.query(query, [id]);

        /*if have find to user*/
        if(result.rowCount != 0){ 
            /*delete the password in the result*/  
            delete result.rows[0].password;
        }
        /*if don't have find to user*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos();
        }else{
        /*else send 200*/
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    /* The function for get all user  */    
    async getAll() {

        /*The query sql for searching all user*/
        const query = `SELECT pseudo, email, roles.name 
                        FROM users
                        JOIN roles ON roles.id = role_id`
        const result = await db.query(query);
        /*is the loop for delete all password ine the result*/
        result.rows.forEach(user => { delete user.password });

        /*if have problem with database send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos(); 
        }else{
        /*else send 200*/
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows);
            return resultInfo.getInfos();
        }
    },

    /* The function for update user  */    
    async update(pseudo, password, email, id) {

        /*the user would change pseudo or email, 
          before we check if the user or the email exist in database*/
        if(pseudo != undefined || email != undefined ) {
            
            /*The query sql check if the user or the email exist in database*/
            const queryVerify = `SELECT *
                                 FROM users
                                 WHERE users.pseudo=$1 OR users.email=$2`;
            /*Check in the database*/
            const resultVerify = await db.query(queryVerify, [pseudo,email]);

            /*If the pseudo or email already taken send 400*/
            if(resultVerify.rowCount >= 1){
                const resultInfo = new ResultInfos(false,400,'Can\'t update. Email/Username Already exist', null);   
                return resultInfo.getInfos();
            } 
        }
        /*for send than the user is updated*/
        let result1 = null;

        /*if the pseudo is undefined go if next*/
        if(pseudo != undefined) {
            const newPseudo = `UPDATE users SET pseudo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
            const result = await db.query(newPseudo,[pseudo, id]); 
            result1 = result;
        }
        /*if the password is undefined go if next*/
        if(password != undefined) {
            const hash = bcrypt.hashSync(password, 10);
            const newPassword = `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING * `
            const result = await db.query(newPassword,[hash, id]);
            result1 = result;
        } 
        /*if the email is undefined go if next*/
          if(email != undefined) {
              const newEmail = `UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
              const result = await db.query(newEmail,[email, id]);
              result1 = result;
          }
          delete result1.rows[0].password;

            const query = `SELECT users.id, pseudo, email, roles.name AS role
             FROM users
             JOIN roles ON roles.id = role_id 
             WHERE users.id=$1`;
            result1 = await db.query(query, [id]);    
            /*Send 200*/
            const resultInfo = new ResultInfos(true,200,'User updated.', {token: createToken(result1.rows[0])});
            return resultInfo.getInfos();      
    },

    /*The function for delete user*/    
    async delete(id) {

        /*searching if the user exist in database*/
        const resultExist = await usersModel.getOneByPk(id);

        /*if the user don't exist send 404*/
        if (!resultExist) {
            const resultInfo = new ResultInfos(false,404,'This User does not exists.', result.rows);
            return resultInfo.getInfos();
        }

        /*The query sql for updated the answers of user before delete, transferred to user 1*/
        const query0 = `UPDATE answers SET user_id = 1
                        WHERE answers.user_id = $1 
                        RETURNING *`;
        const result0 = await db.query(query0, [id]);
        

        /*The query sql for updated the votes of user before delete, transferred to user 1*/
        const query1 = `UPDATE users_has_answers SET user_id = 1
                        WHERE users_has_answers.user_id = $1 
                        RETURNING *`;
        const result1 = await db.query(query1, [id]);
        

        /*The query sql for delete the user in database*/
        const query = `DELETE FROM users 
                       WHERE id = $1 
                       RETURNING *`;
        const result = await db.query(query, [id]);

        /*Send 200*/
        const resultInfo = new ResultInfos(true,200,'User deleted.', result);
        return resultInfo.getInfos();
    },

    /*This the function for create new User, is useful for create account*/
    async retrievedPass(email) {

        /*The query sql for verify if pseudo or email exist already*/
        const queryVerify = `SELECT users.email FROM users 
                             WHERE users.email = $1`;                 
        const resultVerify = await db.query(queryVerify, [email]);

        if (resultVerify.rowCount === 0) {
            const resultInfo = new ResultInfos(false,400,'Can\'t find user email.', null);   
            return resultInfo.getInfos();
        };

        function randomIntFromInterval(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
          
        const rndInt = randomIntFromInterval(100000, 999999)
        const randomHash = bcrypt.hashSync(rndInt.toString(), 10);
        const query = `UPDATE users SET password = $2
                       WHERE users.email = $1 RETURNING *`;                 
        const result = await db.query(query, [email, randomHash]);

        const text = `Bonjour ${result.rows[0].pseudo}, 
            
        Nous avons réceptionné une demande pour un changement de mot de passe.
        Ci-dessous votre nouveau mot de passe! 
        Penses à le changer après t'être connecté!!

        ${rndInt}
        
        Merci.
        Cordialement,
        L'équipe d'Absurdity
        www.absurdity.vercel.app
        `
        await sendEmail(resultVerify.rows[0].email,"Forget password",text);

        /*delete the password in the result*/
        delete result.rows[0].password;

        /*if have problem with database send 404*/
        if (result.rowCount === 0) {
        const resultInfo = new ResultInfos(false,400,'Can\'t send password.', null);   
        return resultInfo.getInfos();
        }else{
        /*else send 200*/
        const resultInfo = new ResultInfos(true,200,'Success to send email password.', result.rows[0]);
        return resultInfo.getInfos();
        }
        
    },


    /* The function for get all user  */    
    async deleteUser(userId) {

        /*The query sql for updated the answers of user before delete, transferred to user 1*/
        const query0 = `UPDATE answers SET user_id = 1
                        WHERE answers.user_id = $1 
                        RETURNING *`;
        const result0 = await db.query(query0, [userId]);
        

        /*The query sql for updated the votes of user before delete, transferred to user 1*/
        const query1 = `UPDATE users_has_answers SET user_id = 1
                        WHERE users_has_answers.user_id = $1 
                        RETURNING *`;
        const result1 = await db.query(query1, [userId]);

        /*The query sql for searching all user*/
        const query = `DELETE FROM users where id = $1`
        const result = await db.query(query, [userId]);
        
        /*if have problem with database send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not deleted.', result);   
            return resultInfo.getInfos(); 
        }else{
        /*else send 200*/
            const resultInfo = new ResultInfos(true,200,'User deleted.', result.rows);
            return resultInfo.getInfos();
        }
    }



};



       
module.exports = usersModel;