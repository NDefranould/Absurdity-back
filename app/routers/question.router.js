const {Router, response} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const questionsController = require('../controllers/questionController');
const tokenAuth = require('../middlewares/auth');

/*Not connected*/
/*This the road get all questions and answers*/ 
router.get('/questions', handlerController(questionsController.getAllQuestions));
/*This the road get only question*/ 
router.get('/question/:questionId',handlerController(questionsController.getQuestionById));
/*This the road for get one question with the answers*/
router.get('/question/:questionId/answers', handlerController(questionsController.getQuestionByIdAnswers));

/*Connected*/
/*This the road for create one answer in the question*/
router.post('/question/:questionId/answer',tokenAuth.checkUser,handlerController(questionsController.getQuestionByIdAndCreateAnswer));

/*Admin*/
/*This the road for update one question*/ 
router.patch('/question/:questionId',tokenAuth.checkUser,handlerController(questionsController.updateQuestion));
/*This the road for delete one question*/ 
router.delete('/question/:questionId',tokenAuth.checkUser,handlerController(questionsController.deleteQuestion));
/*This the road for create question*/ 
router.post('/questions',tokenAuth.checkUser,handlerController(questionsController.createQuestion));

module.exports = router;