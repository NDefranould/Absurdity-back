require('dotenv').config();
const users = require("../models/users");
const jwt = require("jsonwebtoken");
const handlerController = require('../controllers/handlerController');

module.exports.checkUser = handlerController((req, res, next) => {
  console.log(req.method,req.url);
  
  const token = req.body.token || req.query.token || null;
  const resToken = token;

  const tokenAuthAdmin = {tokenStatus: false, error: null};
  if (resToken) {
    jwt.verify(resToken, process.env.PASSPHRASE, 
      async (err, decodedToken) => {
        console.log('Decodedtoken =', decodedToken);
        if (err) {
          tokenAuthAdmin.error = 'The token is invalid.' + err;
        } else {
          const user = await users.getOneByPk(decodedToken.id);
          const { pseudo, email , role } = decodedToken;
            if (user) { 
              if(pseudo != user.data.pseudo || email != user.data.email || role != "admin"){
                tokenAuthAdmin.error = 'You shall not pass';
              }else{
                tokenAuthAdmin.tokenStatus = true;
              }
            }
            else {
              tokenAuthAdmin.error = 'no user found with token id';
            };
        };

        if(tokenAuthAdmin.tokenStatus === true && tokenAuthAdmin.error === null){
          if(req.url === '/checkuser'){
            tokenAuthAdmin.queryStatus = true;
            res.status(200).json(tokenAuthAdmin);
          }else{
            req.params.id = decodedToken.id;
            req.params.token = tokenAuthAdmin;
            next();
        }
        }else{
          res.status(511).json({tokenAuthAdmin});
        }
      }
    );
  } else {
    tokenAuthAdmin.error = 'no token';
    res.status(511).json({tokenAuthAdmin});
  }

});