const {Router, response, application} = require('express');
const router = Router();
const questionRouter = require('./routers/question.router');
const userRouter = require('./routers/user.router');


/* Router User*/
router.use(userRouter);

/* Router Questions*/
router.use(questionRouter);




module.exports = router;