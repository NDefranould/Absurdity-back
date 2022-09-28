const {Router, response, application} = require('express');
const router = Router();
const usersController = require('./controllers/usersController');
const handlerController = require('./controllers/handlerController');
const tokenAuth = require('./middlewares/auth');
const questionRouter = require('./routers/question.router');


router.use(questionRouter);

/* This is the route for create new Account */
router.post('/sign-up', handlerController(usersController.createUser));
// This is the route for the validation of connexion
router.post('/login', handlerController(usersController.findUserByPseudoOrEmail));

/* This is the route for Find user By Id */
router.get('/user',tokenAuth.checkUser,handlerController(usersController.getUserById));
/*OK*/
router.get('/users', handlerController(usersController.getAllUsers));


module.exports = router;