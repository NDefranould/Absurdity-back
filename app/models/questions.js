const db = require('../config/db');


const questionsModel = {

    async findByPk(id) {
        const result = await db.query(`SELECT questions.content, answers.content, vote_count FROM questions
                                       INNER JOIN answers ON question_id = answers.question_id
                                       WHERE questions.id = $1`, [id]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
    },

    async findAll() {
        const result = await db.query(`SELECT questions.content, answers.content, vote_count 
                                       FROM questions INNER JOIN answers ON 
                                       question_id = answers.question_id`);
                                       

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows;
    },
}

module.exports = questionsModel;