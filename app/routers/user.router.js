const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const tokenAuth = require('../middlewares/auth');

/*Not connected*/
/*This is the route for create new Account*/
router.post('/sign-up',handlerController(usersController.signup));
/*This is the route for the validation of connexion*/
router.post('/login',handlerController(usersController.login));

/*Connected*/
/*This is the route for Find user By Id */
router.post('/user',tokenAuth.checkUser,handlerController(usersController.getOneByPk));
/*This is the route for verify token for front*/
router.post('/checkuser',tokenAuth.checkUser);
/*This is the route for update the account of the user */
router.patch('/user',tokenAuth.checkUser,handlerController(usersController.update));
/*This is the route for delete the account of the user */
router.delete('/user',tokenAuth.checkUser,handlerController(usersController.delete));

/*Admin*/
/*This is the route for watch all users*/
router.post('/users',tokenAuth.checkUser, handlerController(usersController.getAll));

module.exports = router;