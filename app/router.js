const {Router} = require('express');
const router = Router();
const questionRouter = require('./routers/question.router');
const userRouter = require('./routers/user.router');
const errorController = require('./controllers/errorController');


/* Router User*/
router.use(userRouter);

/* Router Questions*/
router.use(questionRouter);

/* Router Error*/
router.use(errorController.__404);


module.exports = router;