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

    async isUnique(inputData, questionId) {
        const fields = [];
        const values = [];
        // On récupère la liste des infos envoyés
        Object.entries(inputData).forEach(([key, value], index) => {
            // On ne garde que les infos qui sont censées être unique
            if (['content'].includes(key)) {
                // On génère le filtre avec ces infos
                fields.push(`"${key}" = $${index + 1}`);
                values.push(value);
            }
        })},
}

module.exports = questionsModel;