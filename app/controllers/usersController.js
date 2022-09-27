const usersModel = require('../models/users');
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
    /* This is the route for loggin, is useful for identify user */
    async findUserByPseudoOrEmail(req, res, next) {
        const {pseudo, password} = req.body;

        const result = await usersModel.findByPseudoOrEmail(pseudo, password);

        if (!result) {
            res.status(401).json(`User not found`);
        } else {
            
            res.json(result);
        }
        
    },
    /*  This is the route for create new User, is useful for create account */
    async createUser(req, res, next) {

       const {pseudo, password, email} = req.body;

       usersModel.create(pseudo,password,email);
            console.log('user created');
       res.send('user created');
    }
};

module.exports = usersController;