const {Router, response} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const questionsController = require('../controllers/questionController');
const tokenAuth = require('../middlewares/auth');

/*OK*/ 
router.get('/questions', handlerController(questionsController.getAllQuestions));
/*OK*/
router.post('/questions', handlerController(questionsController.createQuestion));
/*OK*/
router.get('/question/:questionId',handlerController(questionsController.getQuestionById));
/*OK*/
router.patch('/question/:questionId',handlerController(questionsController.updateQuestion));
/*OK*/
router.delete('/question/:questionId',handlerController(questionsController.deleteQuestion));

/*recupere la question et ses answers*/
router.post('/question/:questionId/answers', handlerController(questionsController.getQuestionByIdAnswers));

// route pour poster une answer
router.post('/question/:questionId/answer',tokenAuth.checkUser,handlerController(questionsController.getQuestionByIdAndCreateAnswer));

module.exports = router;