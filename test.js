"use strict";
const db = require('./app/config/db');
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nicolasdefranould@gmail.com", // generated ethereal user
      pass: "ljjlpdztfpuysxra", // generated ethereal password
    },
  });

  const queryVerify = `SELECT users.password FROM users 
                       WHERE users.id = $1`;                 
  const resultVerify = await db.query(queryVerify, [id]);
        

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "nicolasdefranould@gmail.com", // sender address
    to: "nicolasdefranould@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: resultVerify.rows[0].password, // plain text body
    
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);