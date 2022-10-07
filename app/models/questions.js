const db = require('../config/db');
const ResultInfos = require('./resultInfo');

const questionsModel = {

    /*This the function for the question of the day*/
    async getQuestionOfTheDay(){

        /* The query sql for search question of the day */
        const result = await db.query(`SELECT q.id, q.content FROM questions q
                                       WHERE question_of_the_day = true `);
        /*if the query don't have find send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Question not found.',null);
            return resultInfo.getInfos()
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },
    
    /*This the function for the question by id*/
    async findByPk(id) {

        /* The query sql for search question content by id*/
       const result = await db.query(`SELECT  questions.content FROM questions
                                      WHERE id = $1`, [id]);
       /*if the query don't have find send 404*/
       if (result.rowCount === 0) {
           const resultInfo = new ResultInfos(false, 404, 'Question not found.',null);
           return resultInfo.getInfos()
       } else {
       /*else the query have find send 200*/
           const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
           return resultInfo.getInfos();
       }
   },

    async getAllQuestionsWithoutAnswer() {

        /*The query sql for search all question order by id descending without answers
          Return question id, content, already_asked,
          date of publication, question of the day, created at, updated at*/
        const result = await db.query(`SELECT * FROM questions ORDER BY id DESC`);

        /*if the query don't have find send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Questions not found.',null);
            return resultInfo.getInfos()
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Questions found.', result.rows);
            return resultInfo.getInfos();
        }
    },
    /*This the function for the question by id with all answers*/
    async findByPkAllAnswers(id) {

        /*The query sql for search question id with all answers
          Return question id,date_pub (publication), question content,
          pseudo.answer (who wrote the answer), answer_id, answer content,
          vote (number of votes on the answer), with all answers by question*/
        const result = await db.query(`SELECT questions.id AS question_id, questions.date_pub AS date_pub, questions.content AS question, json_agg(questions.request) AS list_answers
                                       FROM (SELECT questions.id , questions.content, questions.date_of_publication AS date_pub,
                                       json_build_object('pseudo', users.pseudo,'answer_id',answers.id,'answer',answers.content,'vote',
                                       answers.vote_count) as request FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       LEFT JOIN users ON users.id = answers.user_id WHERE questions.id = $1
                                       GROUP BY questions.id,questions.content,date_pub,answers.content,answers.vote_count,answers.id,users.pseudo
                                       ORDER BY answers.vote_count DESC) as questions
                                       GROUP BY questions.id, questions.content,questions.date_pub`, [id]);
        /*if the query don't have find send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Question not found.', null);
            return resultInfo.getInfos()
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    /*This the function for retrieved all questions and answers*/
    async getAll() {

        /*The query sql for search all questions with the answers
          Return question id,date_pub (publication), question content,
          pseudo.answer (who wrote the answer), answer_id, answer content,
          vote (number of votes on the answer), with all answers by question*/
        const result = await db.query(`SELECT questions.id AS question_id, questions.content AS question,questions.date_pub AS date_pub,json_agg(questions.request) AS list_answers
                                       FROM (SELECT questions.id, questions.content,questions.date_of_publication AS date_pub,
                                       json_build_object('pseudo', users.pseudo,'answer_id',answers.id,'answer',answers.content,'vote',
                                       answers.vote_count) as request FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       LEFT JOIN users ON users.id = answers.user_id
                                       WHERE questions.date_of_publication IS NOT NULL
                                       GROUP BY questions.id, questions.content,date_pub,answers.content,answers.vote_count,answers.id,users.pseudo
                                       ORDER BY answers.vote_count DESC) as questions
                                       GROUP BY  questions.id, questions.content,questions.date_pub 
                                       ORDER BY date_pub DESC`);
        /*if the query don't have find send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Questions not found.', null);
            return resultInfo.getInfos()
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Questions found.', result.rows);
            return resultInfo.getInfos();
        }
    },


    /*This the function for create new question*/ 
    async create(content) {

        /* The query sql for create the new question*/
        const result = await db.query(`INSERT INTO "questions" 
                                       (content) VALUES ($1)`, [content]);
        /*if the query don't have find send 404*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'User not found.', null);
            return resultInfo.getInfos()
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Question created.', result.rows[0]);
            return resultInfo.getInfos();
        }

    },

    /*This the function for delete one question by id*/ 
    async delete(id) {

        /* The query for search if the question with id exist*/
        const resultExist = await questionsModel.findByPk(id);

        /*if the question with id don't exist send 404*/
        if (resultExist.data.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'This Question does not exists.', null);
            return resultInfo.getInfos();
        }
        /* The query sql for delete the question by id*/
        const result = await db.query('DELETE FROM questions WHERE id = $1', [id]);
        /*the query send 200*/
        const resultInfo = new ResultInfos(true, 200, 'Question deleted.', result.rows[0]);
        return resultInfo.getInfos();
    },

    /*This the function for update one question*/
    async update(question, id) {

        /*The query for search the question to updated with content by id*/
        const query = `UPDATE questions 
                       SET content = $1 WHERE id = $2`
        const result = await db.query(query, [question, id]);

         /*if the question with id don't exist send 400*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t update.', null);
            return resultInfo.getInfos();
        } else {
        /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Question updated.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    /*This the function for create one answer*/
    async createAnswer(content, id, questionId) {

        /* The query verify is user don't have already put answer this question*/
        const queryVerify = `SELECT questions.content AS questions , answers.user_id AS user_id FROM questions
                             LEFT JOIN answers ON answers.question_id = questions.id
                             WHERE answers.user_id = $1 AND questions.id = $2 `;
        const resultVerify = await db.query(queryVerify, [id,questionId]);

        /*if the user have already put answer send 400*/
        if(resultVerify.rowCount > 0){
            const resultInfo = new ResultInfos(false,400,'Can\'t put more one answer by questions', null);   
            return resultInfo.getInfos();
        } 
        /* The query for create one answer*/
        const result = await db.query(`INSERT INTO answers (content,user_id,question_id)
                                 VALUES ($1,$2,$3)`, [content, id, questionId]);
        /*if the answer don't create send 400*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t anwser created.', null);
            return resultInfo.getInfos();
        } else {
            /*else the query have find send 200*/
            const resultInfo = new ResultInfos(true, 200, 'Answer created.', result.rows[0]);
            return resultInfo.getInfos();
        }

    },
    
    /*This the function for vote for only answer by question*/
    async voted(userId,questionId,answerId) {

        /*The query sql verify is user don't have already voted for this question*/
        const queryVerify = `SELECT answer_id FROM users_has_answers
                             WHERE user_id = $1 AND
                             question_id = $2`;                 
        const resultVerify = await db.query(queryVerify, [userId, questionId]);

        /*if the user have already voted send 400*/
        if(resultVerify.rowCount > 0){
            const resultInfo = new ResultInfos(false,400,'Can\'t put more vote answer by question', null);   
            return resultInfo.getInfos();
        } 
        /*The query sql add user id, question id and answer id for consider the vote*/
            const query = `INSERT INTO users_has_answers (user_id,question_id,answer_id) VALUES ($1,$2,$3)`
            const result = await db.query(query, [userId,questionId,answerId]);

        /*if have problem in database send 400*/
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t voted.', null);
            return resultInfo.getInfos();
        } else {
        /*The query sql add +1 in the count for the answer*/
            const count = await db.query(`UPDATE answers SET vote_count = (vote_count+1)
                                          WHERE answers.id = $1`, [answerId]);
            const resultInfo = new ResultInfos(true, 200, 'Vote updated.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    /*This the function for unvoted the answer*/
    async unvoted(userId, questionsId, answerId) {

        /* The query sql delete the vote in database*/
        const result = await db.query(`DELETE FROM users_has_answers
                                       WHERE user_id = $1 AND question_id = $2`, [userId, questionsId]);
        /*if have problem in database send 400*/                          
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t unvoted.', null);
            return resultInfo.getInfos();
        } else {
            /*The query sql remove -1 in the count for the answer*/
            const count = await db.query(`UPDATE answers SET vote_count = (vote_count-1)
                                          WHERE answers.id = $1`, [answerId]);
            const resultInfo = new ResultInfos(true, 200, 'unVoted .', result.rows[0]);
            return resultInfo.getInfos();
        }
    },


}

module.exports = questionsModel;