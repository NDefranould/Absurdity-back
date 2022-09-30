const db = require('../config/db');
const ResultInfos = require('./resultInfo');

const questionsModel = {


    async findByPk(id) {
        const result = await db.query(`SELECT  questions.content FROM questions
                                       WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },
    async findByPkAllAnswers(id) {
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       WHERE questions.id = $1
                                       GROUP BY questions`, [id]);

        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows[0]);
            return resultInfo.getInfos();
        }
    },

    async findAll() {
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       GROUP BY questions`);
                                       
        if (result.rowCount === 0) {
            const resultInfo = new ResultInfos(false,404,'User not found.', result);   
            return resultInfo.getInfos()
        } else {
            const resultInfo = new ResultInfos(true,200,'User found.', result.rows);
            return resultInfo.getInfos();
        }
    },

    async create(content) {
        
        const result = await db.query(`INSERT INTO "questions" (content) VALUES ($1)`,  [content] );
        
        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];

    },
    async delete(id) {
        const result = await db.query('DELETE FROM questions WHERE id = $1', [id]);
        return !!result.rowCount;
    },
    async update(id, question) {
        const fields = Object.keys(question).map((prop, index) => `"${prop}" = $${index + 1}`);
        const values = Object.values(question);

        const savedQuestion = await db.query(
            `
                UPDATE questions SET
                    ${fields}
                WHERE id = $${fields.length + 1}
                RETURNING *
            `,
            [...values, id],
        );

        return savedQuestion.rows[0];
    },

    async createAnswer(content,id,questionId) {
        
        const result = await db.query(`INSERT INTO answers (content,user_id,question_id) VALUES ($1,$2,$3)`,  [content,id,questionId] );
        
        if (result.rowCount === 0 ) {
            return undefined;
        }

        return result.rows[0];

    },

    
}

module.exports = questionsModel;