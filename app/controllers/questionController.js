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
    async getQuestionByIdAnswers(req, res, next) {
        const id = req.params.id;
        const question = await questionsModel.findByPkAllAnswers(id);
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

    },

    async createQuestion(req, res, next) {

        const {content} = req.body;
 
        questionsModel.create(content);
             console.log('question created');
        res.send('question created');
     },

     async updateQuestion(req, res) {
         
        const result = await questionsModel.findByPk(req.params.id);
        
        if (!result) {
            console.log("The question don't exist (id)");
        }
        if (req.body.content) {
            const existingQuestion = await questionsModel.isUnique(req.body, req.params.id);
            
            if (existingQuestion) {
                let field;
                if (existingQuestion.content === req.body.content) {
                    field = 'content';
                } else {
                    console.log(error);
                    
                }
            }
        }

        const savedQuestion = await questionsModel.update(req.params.id, req.body);
        return res.json(savedQuestion);
    },

     async deleteQuestion(req, res, next) {
        const result = await questionsModel.findByPk(req.params.id);
        if (!result) {
            throw new ApiError('This question does not exists', { statusCode: 404 });
        }
        await questionsModel.delete(req.params.id);
        return res.status(204).json();
    }
        








}

module.exports = questionsController;