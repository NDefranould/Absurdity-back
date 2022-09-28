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
router.get('/question/:id',handlerController(questionsController.getQuestionById));
/*OK*/
router.patch('/question/:id',handlerController(questionsController.updateQuestion));
/*OK*/
router.delete('/question/:id',handlerController(questionsController.deleteQuestion));
/*OK*/
router.get('/question/:id/answers', handlerController(questionsController.getQuestionByIdAnswers));

module.exports = router;