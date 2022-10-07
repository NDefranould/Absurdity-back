const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const questionsController = require('../controllers/questionController');

const tokenAuth = require('../middlewares/auth');

/*Users*/
/*This is the route for create new Account*/
router.post('/sign-up',handlerController(usersController.signup));
/*This is the route for the validation of connexion*/
router.post('/login',handlerController(usersController.login));
/*This is the route for verify token for front*/
router.get('/checkuser',tokenAuth.checkUser);

/*Questions*/
/*This the road get question of the day without answer*/ 
router.get('/dailyquestion', handlerController(questionsController.getQuestionOfTheDay));
/*This the road get all questions and answers*/ 
router.get('/questions', handlerController(questionsController.getAllQuestions));
/*This the road get only question*/ 
router.get('/question/:questionId',handlerController(questionsController.getQuestionById));
/*This the road for get one question with the answers*/
router.get('/question/:questionId/answers', handlerController(questionsController.getQuestionByIdAnswers));

module.exports = router;