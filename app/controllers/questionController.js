const questionsModel = require('../models/questions');
const jwt = require("jsonwebtoken");

const questionsController = {

    /*This the function for the question of the day*/ 
    async getQuestionOfTheDay(req, res, next){
        /*Call the function for question of the day
          Return question id and content*/
        const result = await questionsModel.getQuestionOfTheDay();
         /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This the function get only question*/ 
    async getQuestionById(req, res, next) {
        /*retrieve question id*/ 
       const id = req.params.questionId;
        /*Call the function findByPk with question id
          Return question content*/ 
       const result = await questionsModel.findByPk(id);
        /*return if function has been applied or not*/ 
       res.status(result.statusCode).json(result);
   },

    /*This the function for get one question with the answers*/
    async getQuestionByIdAnswers(req, res, next) {
        /*retrieve question id*/ 
        const id = req.params.questionId;
        /*Call the function findByPkAllAnswers with question id
          Return question id,date_pub (publication), question content,
          pseudo.answer (who wrote the answer), answer_id, answer content,
          vote (number of votes on the answer), with all answers by question*/
        const result = await questionsModel.findByPkAllAnswers(id);
        /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This the function get all questions and answers*/ 
    async getAllQuestions(req, res, next) {
        /*Call the function getAll
          Return question id,date_pub (publication), question content,
          pseudo.answer (who wrote the answer), answer_id, answer content,
          vote (number of votes on the answer), with all answers by question*/
        const result = await questionsModel.getAll();
        /*return if function has been applied or not*/
        res.status(result.statusCode).json(result);
    },

    /*This the function get all questions without answers*/ 
    async getAllQuestionsWithoutAnswers(req, res, next) {

        /*Call the function getAllQuestionsWithoutAnswer
          Return question id order by descending, content, already_asked,
          date of publication, question of the day, created at, updated at*/
        const result = await questionsModel.getAllQuestionsWithoutAnswer();
        /*return if function has been applied or not*/
        res.status(result.statusCode).json(result);

    },

    /*This the function for create question*/ 
    async createQuestion(req, res, next) {
        /*retrieve body for have content of the futur new question*/
        const {content} = req.body;
        /*Call the function create with the content for the new question*/
        const result = await questionsModel.create(content);
         /*return if function has been applied or not*/      
        res.status(result.statusCode).json(result);
     },

     /*This the function for update one question*/
     async updateQuestion(req, res) {
        /*Call the function create with the new content and
          question id for update the question*/
        const result = await questionsModel.update(req.body.content, req.params.questionId);
         /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result); 
    },

    /*This the function for delete one question*/ 
     async deleteQuestion(req, res, next) {
        /*Call the function with the question id for delete this question*/
        const result = await questionsModel.delete(req.params.questionId);
        /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This the function for create one answer in the question*/
    async getQuestionByIdAndCreateAnswer(req, res, next) {

            /*retrieve the content for the new answer*/
            const {content} = req.body
            /*retrieve user id by the token*/
            const id = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
                return decodedToken.id;
            });
            /*retrieve question id*/
            const {questionId} = req.params
            /*Call the function createAnswer with the new content, user id and
              question id for create new answer by question*/
            const result = await questionsModel.createAnswer(content,id,questionId);
            /*return if function has been applied or not*/
            res.status(result.statusCode).json(result);
    },
    async haveIvoted(req,res,next) {
       /*retrieve user id by the token*/
       const userId = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
           return decodedToken.id;
       });
       /*retrieve question id*/
       const {questionId} = req.params;
       /*Call the function voted with the answer id, user id and
         question id for vote one answer by question*/
       const result = await questionsModel.haveIvoted(userId,questionId);
       /*return if function has been applied or not*/
       res.status(result.statusCode).json(result);
    },
    /*This the function for vote for only answer by question*/
    async votedAnswer(req, res, next) {
        
        /*retrieve answer id*/
        const {answerId} = req.params;
        /*retrieve user id by the token*/
        const userId = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
            return decodedToken.id;
        });
        /*retrieve question id*/
        const {questionId} = req.body.content;

        /*Call the function voted with the answer id, user id and
          question id for vote one answer by question*/
        const result = await questionsModel.voted(userId,questionId,answerId);
        /*return if function has been applied or not*/
        res.status(result.statusCode).json(result);
    },

    /*This the function for unvoted answer*/
    async unvotedAnswer(req, res, next) {
        /*retrieve user id*/
        const userId = jwt.verify(req.query.token,process.env.PASSPHRASE, (err, decodedToken) => {
          return decodedToken.id;
      });
      
        /*retrieve question id*/
        const {questionId} = req.body.content;

        /*retrieve answer id*/
        const {answerId} = req.params;
        /*Call the function unvoted with the answer id, user id and
          question id for unvoted the answer*/
        const result = await questionsModel.unvoted(userId,questionId, answerId);
         /*return if function has been applied or not*/ 
        res.status(result.statusCode).json(result);
    },

    /*This the function for unvoted answer*/
    async deleteAnswerAndVote(req, res, next) {
      
      /*retrieve answer id*/
      const {questionId, answerId} = req.params;

      /*Call the function unvoted with the answer id, user id and
        question id for unvoted the answer*/
      const result = await questionsModel.deleteAnswerVote(questionId, answerId);
       /*return if function has been applied or not*/ 
      res.status(result.statusCode).json(result);
  },

    
};

module.exports = questionsController;