const {Router} = require('express');
const router = Router();
const usersController = require('./controllers/usersController');


router.get('/users', usersController.findUserInAllUser);
router.get('/user/:id',usersController.getUserById);
router.post('/sign-up', usersController.createUser);








module.exports = router;