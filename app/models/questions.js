const db = require('../config/db');
const ResultInfos = require('./resultInfo');

const questionsModel = {

    async getQuestionOfTheDay(){
        const result = await db.query(`SELECT q.id, q.content FROM questions q
        WHERE question_of_the_day = true `, []);

        if (result.rowCount === 0) {
        const resultInfo = new ResultInfos(false, 404, 'Question not found.',null);

        return resultInfo.getInfos()
        } else {
        const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
        return resultInfo.getInfos();
    }
    },
    async findByPk(id) {
        const result = await db.query(`SELECT  questions.content FROM questions
                                       WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Question not found.',null);
            
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },
    async findByPkAllAnswers(id) {
        const result = await db.query(`SELECT questions.id AS question_id, questions.date_pub AS date_pub, questions.content AS question, json_agg(questions.request) AS list_answers
        FROM (
        
        SELECT questions.id , questions.content, questions.date_of_publication AS date_pub,
            json_build_object('pseudo', users.pseudo,'answer_id',answers.id,'answer',answers.content,'vote',
                                             answers.vote_count) as request
        FROM questions
        LEFT JOIN answers ON answers.question_id = questions.id
        LEFT JOIN users ON users.id = answers.user_id
        WHERE questions.id = $1
        GROUP BY questions.id,questions.content,date_pub,answers.content,answers.vote_count,answers.id,users.pseudo
        ORDER BY answers.vote_count DESC) as questions
        GROUP BY questions.id, questions.content,questions.date_pub`, [id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Question not found.', null);
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    async getAll() {
        const result = await db.query(`SELECT questions.id AS question_id, questions.content AS question,questions.date_pub AS date_pub,json_agg(questions.request) AS list_answers
        FROM (
        
        SELECT questions.id, questions.content,questions.date_of_publication AS date_pub,
            json_build_object('pseudo', users.pseudo,'answer_id',answers.id,'answer',answers.content,'vote',
                                             answers.vote_count) as request
        FROM questions
        LEFT JOIN answers ON answers.question_id = questions.id
        LEFT JOIN users ON users.id = answers.user_id
        WHERE questions.date_of_publication IS NOT NULL
        GROUP BY questions.id, questions.content,date_pub,answers.content,answers.vote_count,answers.id,users.pseudo
        ORDER BY answers.vote_count DESC) as questions
        GROUP BY  questions.id, questions.content,questions.date_pub 
        ORDER BY date_pub DESC`);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Questions not found.', null);
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Questions found.', result.rows);
            return resultInfo.getInfos();
        }
    },


    async create(content) {

        const result = await db.query(`INSERT INTO "questions" 
                                       (content) VALUES ($1)`, [content]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'User not found.', null);
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Question created.', result.rows[0]);
            return resultInfo.getInfos();
        }

    },
    async delete(id) {
        const resultExist = await questionsModel.findByPk(id);

        if (resultExist.data.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'This Question does not exists.', null);
            return resultInfo.getInfos();
        }
        const result = await db.query('DELETE FROM questions WHERE id = $1', [id]);

        const resultInfo = new ResultInfos(true, 200, 'Question deleted.', result.rows[0]);
        return resultInfo.getInfos();
    },
    async update(question, id) {
        const query = `UPDATE questions 
                       SET content = $1 WHERE id = $2`
        const result = await db.query(query, [question, id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t update.', null);
            return resultInfo.getInfos();
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Question updated.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    async createAnswer(content, id, questionId) {

            const queryVerify = `SELECT questions.content AS questions , answers.user_id AS user_id FROM questions
                                 LEFT JOIN answers ON answers.question_id = questions.id
                                 WHERE answers.user_id = $1  AND questions.id = $2 `;
                                    
            const resultVerify = await db.query(queryVerify, [id,questionId]);
            
           
            if(resultVerify.rowCount > 0){
                const resultInfo = new ResultInfos(false,400,'Can\'t put more one answer by questions', null);   
                return resultInfo.getInfos();
            } 
        
        const result = await db.query(`INSERT INTO answers (content,user_id,question_id)
                                     VALUES ($1,$2,$3)`, [content, id, questionId]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 400, 'Can\'t anwser created.', null);
            return resultInfo.getInfos();
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Answer created.', result.rows[0]);
            return resultInfo.getInfos();
        }

    },
    
        async voted(userId,questionId, _i) {
            const queryVerify = `SELECT answer_id FROM users_has_answers
                                 WHERE user_id = $1 AND
                                 question_id = $2`;                 
            const resultVerify = await db.query(queryVerify, [userId, questionId]);
            console.log(resultVerify.rowCount);
            if(resultVerify.rowCount > 0){
                const resultInfo = new ResultInfos(false,400,'Can\'t put more vote answer by question', null);   
                return resultInfo.getInfos();
            } 

            const query = `INSERT INTO users_has_answers (user_id,question_id,answer_id) VALUES ($1,$2,$3)`
            const result = await db.query(query, [userId,questionId,answerId]);

            

            if (result.rowCount === 0) {
                const resultInfo = new ResultInfos(false, 400, 'Can\'t voted.', null);
                return resultInfo.getInfos();
            } else {
                const count = await db.query(`UPDATE answers SET vote_count = (vote_count+1)
                                              WHERE answers.id = $1`, [answerId]);
                const resultInfo = new ResultInfos(true, 200, 'Vote updated.', result.rows[0]);
                return resultInfo.getInfos();
            }
        },
        async unvoted(userId, questionsId, answerId) {
            
            const result = await db.query(`DELETE FROM users_has_answers
                                           WHERE user_id = $1 AND question_id = $2`
            , [userId, questionsId]);

            if (result.rowCount === 0) {
                const resultInfo = new ResultInfos(false, 400, 'Can\'t unvoted.', null);
                return resultInfo.getInfos();
            } else {
                const count = await db.query(`UPDATE answers SET vote_count = (vote_count-1)
                                              WHERE answers.id = $1`, [answerId]);
                const resultInfo = new ResultInfos(true, 200, 'unVoted .', result.rows[0]);
                return resultInfo.getInfos();
            }
        },


}

module.exports = questionsModel;