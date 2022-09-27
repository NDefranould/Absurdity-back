const questionsModel = require('../models/questions');

const questionsController = {


    async getQuestionById(req, res, next) {
        const id = req.params.id;
        const question = await questionsModel.findByPk(id);
        if (!question) {
            res.send(`Question not found`)
        } else {
            res.json(question);
        }

    },

    async getAllQuestions(req, res, next) {

        const questions = await questionsModel.findAll();
        console.log(questions);
        if (!questions) {
            res.send(`Questions not found`)
        } else {
            res.json(questions);
        }

    }







}

module.exports = questionsController;