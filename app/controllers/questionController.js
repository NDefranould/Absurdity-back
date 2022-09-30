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
         
        const result = await questionsModel.findByPk(req.params.questionId);
        
        if (!result) {
            console.log("The question don't exist (id)");
        }else {
            
            const dbQuestions = await db.query(`SELECT questions.content FROM questions`);
                
            const existQuestions =  async function() {
                for (let index = 0; index < dbQuestions.rowCount; index++) {
                    let element = await dbQuestions.rows[index];
                    if(req.body.content === element.content) {
                        console.log('questions exists');
                        return true
                    } 
                } 
                return false;
            }
            if  (!await existQuestions()) {
                const savedQuestion = await questionsModel.update(req.params.questionId, req.body);
                res.json(savedQuestion);
            } else {
                res.json("Questions exists");
            }

        }
    },

     async deleteQuestion(req, res, next) {
        const result = await questionsModel.findByPk(req.params.questionId);
        if (!result) {
            throw new ApiError('This question does not exists', { statusCode: 404 });
        }
        await questionsModel.delete(req.params.questionId);
        return res.status(204).json();
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