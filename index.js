require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
const router = require('./app/router');
const questionOfTheDay = require('./app/middlewares/questionOfTheDay');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({type: ['application/json', 'text/plain']}));

app.use(cors());
app.use(router);

app.listen(port, () => {
    questionOfTheDay.init();
    console.log(`Server app listening on   http://localhost:${port}`);
});