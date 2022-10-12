const {Router} = require('express');
const router = Router();

const noConnectedRouter = require('./routers/noconnected.router');
const ConnectedRouter = require('./routers/connected.router');
const adminRouter= require('./routers/admin.router');

/* Router noConnected*/
router.use(noConnectedRouter);

/* Router connectedRouter*/
router.use(ConnectedRouter);

/* Router AdminRouter*/
router.use(adminRouter);



module.exports = router;