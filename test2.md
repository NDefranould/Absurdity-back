var nodemailer = require("nodemailer");
const ResultInfos = require('./app/models/resultInfo');

async function main() {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nicolasdefranould@gmail.com",
            pass: "ljjlpdztfpuysxra"
        }
    });
    
    const info = await transporter.sendMail({
        from: "nicolasdefranould@gmail.com", 
        to: "nicolasdefranould@gmail.com",  
        subject: "Hello ✔", 
        text:  "Click here for verify your email " + `http://localhost:3000/verifyEmail`,
        
      });
        /*else send 200*/
        const resultInfo = new ResultInfos(true,200,'Success to send email confirmation.');
        return resultInfo.getInfos();
}

    



main().catch(console.error);