require('dotenv').config();
const usersModel = require('../models/users');


const usersController = {
    /*  This is the route for create new User, is useful for create account */
    async signup(req, res, next) {

        const {pseudo, password, email} = req.body;
        const result = await usersModel.signup(pseudo,password,email);

        res.status(result.statusCode).json(result);
    },

    /* This is the route for loggin, is useful for identify user */ //OK
    async login(req, res, next) {
        const {pseudo, password} = req.body;
        const result = await usersModel.login(pseudo, password);    

        res.status(result.statusCode).json(result);
    },

    /* This is route for search the user by the id */ // OK
   async getOneByPk(req, res, next) {
        const id = req.params.id;
        const user = await usersModel.getOneByPk(id);

        res.status(user.statusCode).json(user);
    },
    /* This is route for get All User */ // OK
    async getAll(req, res, next) {
        const users = await usersModel.getAll();

        res.status(users.statusCode).json(users);
    },
   
    /*  This is the route for create new User, is useful for create account */
    async update(req, res) {
        const {pseudo, password, email} = req.body
        const result = await usersModel.update(pseudo, password, email, req.params.id);

        res.status(result.statusCode).json(result);
    },

    /*  This is the route for delete User */
    async delete(req, res, next) {
        const id = req.params.id;
        const result = await usersModel.delete(id);

        res.status(result.statusCode).json(result);
    },

    
};

module.exports = usersController;