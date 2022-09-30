require('dotenv').config();
const users = require("../models/users");
const jwt = require("jsonwebtoken");
const handlerController = require('../controllers/handlerController');

module.exports.checkUser = handlerController((req, res, next) => {
  const resToken = JSON.parse(req.body.token);
  const tokenAuth = {tokenStatus: false, error: null};
  if (resToken) {
    jwt.verify(resToken,process.env.PASSPHRASE, 
      async (err, decodedToken) => {
        if (err) {
          tokenAuth.error = 'The token is invalid.';
        } else {
          const user = await users.getOneByPk(decodedToken.id);
          const { pseudo, email , role } = decodedToken;
            if (user) {
              if(pseudo != user.data.pseudo || email != user.data.email || role != user.data.role){
                tokenAuth.error = 'token and user have no correspondance';
              }else{
                tokenAuth.tokenStatus = true;
              }
            }
            else {
              tokenAuth.error = 'no user found with token id';
            };
        };

        if(tokenAuth.tokenStatus === true && tokenAuth.error === null){
          console.log(req.url);
          if(req.url === '/checkuser'){
            tokenAuth.queryStatus = true;
            res.status(200).json(tokenAuth);
          }else{
            req.params.id = decodedToken.id;
            req.params.token = tokenAuth;
            next();
        }
        }else{
          res.status(511).json({tokenAuth});
        }
      }
    );
  } else {
    tokenAuth.error = 'no token';
    res.status(511).json({tokenAuth});
  }

});