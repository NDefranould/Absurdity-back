const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const questionsController = require('../controllers/questionController');

const tokenAuth = require('../middlewares/auth');

/*Authentification*/
router.use(tokenAuth.checkUser);

/*Users*/
/*This is the route for watch all users*/
router.post('/users',handlerController(usersController.getAll));

/*Questions*/
/*This the road for update one question*/ 
router.patch('/question/:questionId',handlerController(questionsController.updateQuestion));
/*This the road for delete one question*/ 
router.delete('/question/:questionId',handlerController(questionsController.deleteQuestion));
/*This the road for create question*/ 
router.post('/questions',handlerController(questionsController.createQuestion));
/*This the road for all questions without answers*/ 
router.get('/admin/questions', handlerController(questionsController.getAllQuestionsWithoutAnswers));



module.exports = router;