const {Router} = require('express');
const router = Router();
const questionRouter = require('./routers/question.router');
const userRouter = require('./routers/user.router');
const errorController = require('./controllers/errorController');
const questionOfTheDay = require('./middlewares/questionOfTheDay');

router.use(questionOfTheDay.init);
/* Router User*/
router.use(userRouter);

/* Router Questions*/
router.use(questionRouter);

/* Router Error*/
router.use(errorController.__404);


module.exports = router;