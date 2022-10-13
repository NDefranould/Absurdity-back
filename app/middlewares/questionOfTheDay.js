const CronJob = require('cron/lib/cron.js').CronJob;
const db = require('../config/db');

async function resetYesterdayQuestion(){

};

async function launchQuestionOfTheDay(){
    const queryReset = `UPDATE questions 
    SET question_of_the_day=false
    WHERE question_of_the_day=true RETURNING *`;
    const resultReset = await db.query(queryReset,[]);
    console.log('-------------------[LAST QUESTION OF THE DAY]-----------------------')
    console.log(resultReset.rows[0]);
    console.log('-------------------------------------------------------------------')

    const query = `UPDATE questions 
                    SET question_of_the_day=true, date_of_publication = CURRENT_TIMESTAMP, already_asked = true 
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
    '0 */5 * * * *', //toutes les 10 minutes : '0 */10 * * * *'  Tous les jours à 12h '00 00 12 * * 0-6',
     async function() {
        await resetYesterdayQuestion();
        await launchQuestionOfTheDay();
        
    }, null , true, 'Europe/Paris');

module.exports = {
    init(req, res ,next){
        console.log('Before job instantiation');
        job.start();
        console.log('After job instantiation');
        

    },
}
