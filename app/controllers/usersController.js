const usersModel = require('../models/users');
const usersController = {
    

   async getUserById(req, res, next) {
        const id = req.params.id;
        const user = await usersModel.findByPk(id);
        if (!user) {
            res.send(`User not found`)
        } else {
            res.json(user);
        }

    },

    findUserInAllUser(req, res, next) {
        res.send(`on vérifie si l'utilisateur existe`);
    },

    async createUser(req, res, next) {

       const {pseudo, password, email} = req.body;

       usersModel.create(pseudo,email,password);
            console.log('user created');
       res.send('user created');
    }
};

module.exports = usersController;