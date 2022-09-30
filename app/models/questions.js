const db = require('../config/db');
const ResultInfos = require('./resultInfo');

const questionsModel = {


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
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       WHERE questions.id = $1
                                       GROUP BY questions`, [id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false, 404, 'Question not found.', null);
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true, 200, 'Question found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    async findAll() {
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       GROUP BY questions`);

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


}

module.exports = questionsModel;