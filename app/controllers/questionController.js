const questionsModel = require('../models/questions');
const db = require('../config/db');
const { host } = require('pg/lib/defaults');
const questionsController = {


    /*This the road get only question*/ 
    async getQuestionById(req, res, next) {

        const id = req.params.questionId;
        const result = await questionsModel.findByPk(id);
        
        res.status(result.statusCode).json(result);

    },
    /*This the road for get one question with the answers*/
    async getQuestionByIdAnswers(req, res, next) {

        const id = req.params.questionId;
        const result = await questionsModel.findByPkAllAnswers(id);
        
        res.status(result.statusCode).json(result);
        

    },
    /*This the road get all questions and answers*/ 
    async getAllQuestions(req, res, next) {

        const result = await questionsModel.findAll();
        
        res.status(result.statusCode).json(result);

    },
    /*This the road for create question*/ 
    async createQuestion(req, res, next) {

        const {content} = req.body;
        const result = await questionsModel.create(content);
             
        res.status(result.statusCode).json(result);
     },
     /*This the road for update one question*/
     async updateQuestion(req, res) {
         
        const result = await questionsModel.update(req.body.content, req.params.questionId);

        res.status(result.statusCode).json(result); 
    },
    /*This the road for delete one question*/ 
     async deleteQuestion(req, res, next) {
        const result = await questionsModel.delete(req.params.questionId);

        res.status(result.statusCode).json(result);
    },
    /*This the road for create one answer in the question*/
    async getQuestionByIdAndCreateAnswer(req, res, next) {
        
            const {content} = req.body
               
            const {id, questionId} = req.params
 
            const result = await questionsModel.createAnswer(content,id,questionId);
            res.status(result.statusCode).json(result);
    }
        








}

module.exports = questionsController;