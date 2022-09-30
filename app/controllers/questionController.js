const questionsModel = require('../models/questions');
const db = require('../config/db');
const { host } = require('pg/lib/defaults');
const questionsController = {



    async getQuestionById(req, res, next) {

        const id = req.params.questionId;
        const result = await questionsModel.findByPk(id);
        
        res.status(result.statusCode).json(result);

    },

    async getQuestionByIdAnswers(req, res, next) {

        const id = req.params.questionId;
        const result = await questionsModel.findByPkAllAnswers(id);
        
        res.status(result.statusCode).json(result);
        

    },

    async getAllQuestions(req, res, next) {

        const result = await questionsModel.findAll();
        
        res.status(result.statusCode).json(result);

    },

    async createQuestion(req, res, next) {

        const {content} = req.body;
        const result = await questionsModel.create(content);
             
        res.status(result.statusCode).json(result);
     },

     async updateQuestion(req, res) {
         
        const result = await questionsModel.update(req.body.content, req.params.questionId);

        res.status(result.statusCode).json(result); 
    },

     async deleteQuestion(req, res, next) {
        const result = await questionsModel.delete(req.params.questionId);
        
        res.status(result.statusCode).json(result);
    },

    async getQuestionByIdAndCreateAnswer(req, res, next) {
        
                const {content} = req.body
               
                const {id, questionId} = req.params
 
        questionsModel.createAnswer(content,id,questionId);
             console.log('answer add');
        res.json('answer add');
    }
        








}

module.exports = questionsController;