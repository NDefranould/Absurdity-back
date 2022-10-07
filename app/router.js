const {Router} = require('express');
const router = Router();
const noConnectedRouter = require('./routers/noconnected.router');
const ConnectedRouter = require('./routers/connected.router');
const adminRouter= require('./routers/admin.router');
const errorController = require('./controllers/errorController');

/* Router noConnected*/
router.use(noConnectedRouter);

/* Router connectedRouter*/
router.use(ConnectedRouter);

/* Router AdminRouter*/
router.use(adminRouter);

/* Router Error*/
router.use(errorController.__404);


module.exports = router;