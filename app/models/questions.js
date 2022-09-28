const db = require('../config/db');


const questionsModel = {


    async findByPk(id) {
        const result = await db.query(`SELECT  questions.content FROM questions
                                       WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
    },
    async findByPkAllAnswers(id) {
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
                                       LEFT JOIN answers ON answers.question_id = questions.id
                                       WHERE questions.id = $1
                                       GROUP BY questions`, [id]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
    },

    async findAll() {
        const result = await db.query(`SELECT DISTINCT questions.content AS questions , ARRAY_AGG(answers.content) AS answers,ARRAY_AGG(vote_count) AS vote_count FROM questions
        LEFT JOIN answers ON answers.question_id = questions.id
        GROUP BY questions`);
                                       

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows;
    },

    async create(content) {
        
        const result = await db.query(`INSERT INTO "questions" (content) VALUES ($1)`,  [content] );
        
        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];

    },
}

module.exports = questionsModel;