require('dotenv').config();
const users = require("../models/users");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token,process.env.PASSPHRASE, //  a remplacer par un .env
      async (err, decodedToken) => {
        if (err) {
          res.json({ tokenStatus: false, error:err });
        } else {
          const user = await users.findByPk(decodedToken.id);
            if (user) {
              req.params.id = decodedToken.id;
              next();
            }
            else {
              res.json({ tokenStatus: false, error:'no user found with token id' })
            };
        }
      }
    );
  } else {
    res.json({ tokenStatus: false, error:'no token' });
  }
};