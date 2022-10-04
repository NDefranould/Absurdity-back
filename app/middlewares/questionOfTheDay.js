const CronJob = require('cron/lib/cron.js').CronJob;
const db = require('../config/db');

async function resetYesterdayQuestion(){
    const query = `UPDATE questions 
                    SET question_of_the_day=false, already_asked = true 
                    WHERE question_of_the_day=true RETURNING *`;
    const result = await db.query(query,[]);
    console.log('-------------------[LAST QUESTION OF THE DAY]-----------------------')
    console.log(result.rows[0]);
    console.log('-------------------------------------------------------------------')
};

async function launchQuestionOfTheDay(){
    const query = `UPDATE questions 
                    SET question_of_the_day=true, date_of_publication = CURRENT_TIMESTAMP
                    WHERE questions.id=(SELECT questions.id 
                                        FROM questions 
                                        WHERE already_asked=false 
                                        ORDER BY random() 
                                        LIMIT 1) 
                    RETURNING *`;
    const result = await db.query(query,[]);
    console.log('-------------------[NEW QUESTION OF THE DAY]-----------------------')
    console.log(result.rows[0]);
    console.log('-------------------------------------------------------------------')
};

const job = new CronJob(
    '00 00 12 * * 0-6',
     function() {
        resetYesterdayQuestion();
        launchQuestionOfTheDay();
        
    }, null , true, 'Europe/Paris');

module.exports = {
    init(req, res ,next){
        console.log('Before job instantiation');
        job.start();
        console.log('After job instantiation');
        

    },
}
