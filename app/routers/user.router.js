const {Router, response} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const tokenAuth = require('../middlewares/auth');

/* This is the route for create new Account */
router.post('/sign-up', handlerController(usersController.signup));
// This is the route for the validation of connexion
router.post('/login', handlerController(usersController.login));

/* This is the route for Find user By Id */
router.get('/user/:id',tokenAuth.checkUser,handlerController(usersController.getUserById));

router.patch('/user/:id',handlerController(usersController.updateUser));
/*OK*/
router.delete('/user/:id',handlerController(usersController.deleteUser));
/*OK*/
router.get('/users', handlerController(usersController.getAllUsers));

module.exports = router;