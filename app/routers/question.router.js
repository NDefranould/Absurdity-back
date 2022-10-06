const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const questionsController = require('../controllers/questionController');
const tokenAuth = require('../middlewares/auth');



router.use(tokenAuth.checkUser);
/*Connected*/
/*This the road for create one answer in the question*/
router.post('/question/:questionId/answer',handlerController(questionsController.getQuestionByIdAndCreateAnswer));
router.post('/question/:answerId/voted',handlerController(questionsController.votedAnswer));
router.delete('/question/:answerId/voted',handlerController(questionsController.unvotedAnswer));
/*Admin*/
/*This the road for update one question*/ 
router.patch('/question/:questionId',handlerController(questionsController.updateQuestion));
/*This the road for delete one question*/ 
router.delete('/question/:questionId',handlerController(questionsController.deleteQuestion));
/*This the road for create question*/ 
router.post('/questions',tokenAuth.checkUser,handlerController(questionsController.createQuestion));
router.get('/admin/questions', handlerController(questionsController.getAllQuestionsWithoutAnswers));

module.exports = router;