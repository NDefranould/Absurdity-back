require('dotenv').config();
const usersModel = require('../models/users');
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (jsonObject) => {
  return jwt.sign( jsonObject, process.env.PASSPHRASE, {
    expiresIn: maxAge,
  });
};

const usersController = {
    
    /* This is route for search the user by the id */
   async getUserById(req, res, next) {
        const id = req.params.id;
        const user = await usersModel.findByPk(id);
        if (!user) {
            res.send(`User not found`)
        } else {
            res.json(user);
        }

    },

    async getAllUsers(req, res, next) {

        const users = await usersModel.findAll();
        console.log(users);
        if (!users) {
            res.send(`users not found`)
        } else {
            res.json(users);
        }

    },
    /* This is the route for loggin, is useful for identify user */
    async login(req, res, next) {
        const {pseudo, password} = req.body;

        const result = await usersModel.login(pseudo, password);
        const token = createToken(result);
        if (!result) {
            res.status(401).json(`User not found`);
        } else {
            res.status(200).json(token);
        }
        
    },
    /*  This is the route for create new User, is useful for create account */
    async signup(req, res, next) {

       const {pseudo, password, email} = req.body;

       const status = await usersModel.signup(pseudo,password,email);
       res.send(status);
    }
};

module.exports = usersController;