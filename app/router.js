const {Router} = require('express');
const router = Router();
const usersController = require('./controllers/usersController');
const handlerController = require('./controllers/handlerController');
const questionsController = require('./controllers/questionController');

/*OK*/ 
router.get('/questions', handlerController(questionsController.getAllQuestions));
/*OK*/
router.post('/questions', handlerController(questionsController.createQuestion));
/*OK*/
router.get('/question/:id',handlerController(questionsController.getQuestionById));
/*OK*/
router.patch('/question/:id',handlerController(questionsController.updateQuestion));
/*OK*/
router.delete('/question/:id',handlerController(questionsController.deleteQuestion));
/*OK*/
router.get('/question/:id/answers', handlerController(questionsController.getQuestionByIdAnswers));
/* This is the route for create new Account */
router.post('/sign-up', handlerController(usersController.createUser));
// This is the route for the validation of connexion
router.post('/login', handlerController(usersController.findUserByPseudoOrEmail));
/* This is the route for Find user By Id */
router.get('/user/:id',handlerController(usersController.getUserById));
/*OK*/
router.get('/users', handlerController(usersController.getAllUsers));













module.exports = router;