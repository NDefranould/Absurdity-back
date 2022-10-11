require('dotenv').config();
const usersModel = require('../models/users');
const jwt = require("jsonwebtoken");


const usersController = {

    /*This is the function for create new User, is useful for create account*/
    async signup(req, res, next) {

        /*retrieve the body and have pseudo, password and email for create user*/
        const {pseudo, password, email} = req.body;
         /*Call the function signup with the pseudo, password and
          email for create user
          Return user id, pseudo, email, role id and date of creation*/
        const result = await usersModel.signup(pseudo,password,email);
         /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This is the function for loggin, is useful for identify user*/ 
    async login(req, res, next) {
        
        /*retrieve the body and have pseudo or email, password for login user*/
        const {pseudo, password} = req.body;
         /*Call the function login with pseudo or email, password for login user
           Return the token*/
        const result = await usersModel.login(pseudo, password);    
        /*return if function has been applied or not*/
        res.status(result.statusCode).json(result);
    },

    /*This is function for search the user by the id*/ 
    async getOneByPk(req, res, next) {

        /*retrieve user id by the token*/
        const id = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
            return decodedToken.id;
        });
        /*Call the function getOneByPk with user id
          Return user id, pseudo, email, role of user*/
        const user = await usersModel.getOneByPk(id);

        /*return if function has been applied or not*/
        res.status(user.statusCode).json(user);
    },

    /*This is function for get All User*/ 
    async getAll(req, res, next) {

        /*Call the function getAll
          Return All users, pseudo, email, name (role of user)*/
        const users = await usersModel.getAll();
        /*return if function has been applied or not*/
        res.status(users.statusCode).json(users);
    },
   
    /*This is the function for create new User, is useful for create account*/
    async update(req, res) {

        /*retrieve the body for have pseudo or password or email but can all retrieve
         for update the personal data*/
        const {pseudo, password, email} = req.body.content;
        /*retrieve user id by the token*/
        const id = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
            return decodedToken.id;});
        /*Call the function getAll
          Return user id, pseudo, email, role id, date of creation, date of updated*/
        const result = await usersModel.update(pseudo, password, email, id);
        /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This is the function for delete User*/
    async delete(req, res, next) {

        /*retrieve user id by the token*/
        const id = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
            return decodedToken.id;
        });
        /*Call the function delete with user id for delete this user*/
        const result = await usersModel.delete(id);
        /*return if function has been applied or not*/
        res.status(result.statusCode).json(result);
    },

    /*This the function for unvoted answer*/
    async passwordForgot(req, res, next) {
      /*retrieve user id*/
      const userId = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
        return decodedToken.id;
    });
      /*Call the function unvoted with the answer id, user id and
        question id for unvoted the answer*/
      const result = await usersModel.retrievedPass(userId);
       /*return if function has been applied or not*/ 
      res.status(result.statusCode).json(result);
    },

    async emailVerify(req, res, next) {
      /*Call the function unvoted with the answer id, user id and
        question id for unvoted the answer*/
      const result = await usersModel.verifyEmail();
       /*return if function has been applied or not*/ 
      res.status(result.statusCode).json(result);
  }

};

module.exports = usersController;