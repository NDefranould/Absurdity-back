const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const tokenAuth = require('../middlewares/auth');

/* This is the route for create new Account */
router.post('/sign-up', handlerController(usersController.signup));
// This is the route for the validation of connexion
router.post('/login', handlerController(usersController.login));

// Route can't access if not logged
/* This is the route for Find user By Id */
router.post('/user',tokenAuth.checkUser,handlerController(usersController.getOneByPk));

router.patch('/user',tokenAuth.checkUser,handlerController(usersController.update));
/*OK*/
router.delete('/user',tokenAuth.checkUser,handlerController(usersController.delete));
/*OK*/

// Route pour un admin
router.post('/users',tokenAuth.checkUser, handlerController(usersController.getAll));

module.exports = router;