const {Router} = require('express');
const router = Router();

const handlerController = require('../controllers/handlerController');
const usersController = require('../controllers/usersController');
const questionsController = require('../controllers/questionController');

const tokenAuth = require('../middlewares/auth');

/*Authentification*/
router.use(tokenAuth.checkUser);

/*Users*/
/*This is the route for Find user By Id */
router.get('/user',handlerController(usersController.getOneByPk));

router.post('/user',handlerController(usersController.passwordForgot));
/*This is the route for update the account of the user */
router.patch('/user',handlerController(usersController.update));
/*This is the route for delete the account of the user */
router.delete('/user',handlerController(usersController.delete));

/*Questions
/*This the road for create one answer in the question*/
router.post('/question/:questionId/answer',handlerController(questionsController.getQuestionByIdAndCreateAnswer));
/*This the road for voted for one answer by question*/
router.post('/question/:answerId/voted',handlerController(questionsController.votedAnswer));
/*This the road for unvoted for the answer*/
router.delete('/question/:answerId/voted',handlerController(questionsController.unvotedAnswer));


module.exports = router;