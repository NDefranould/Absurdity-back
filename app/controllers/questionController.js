const questionsModel = require('../models/questions');
const db = require('../config/db');
const { host } = require('pg/lib/defaults');
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
                const savedQuestion = await questionsModel.update(req.params.id, req.body);
                res.json(savedQuestion);
            } else {
                res.json("Questions exists");
            }

        }
    },

     async deleteQuestion(req, res, next) {
        const result = await questionsModel.findByPk(req.params.id);
        if (!result) {
            throw new ApiError('This question does not exists', { statusCode: 404 });
        }
        await questionsModel.delete(req.params.id);
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