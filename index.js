require('dotenv').config();
const express = require('express');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({type: ['application/json', 'text/plain']}));
const router = require('./app/router');

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('Hello world !!');
});

app.use(cors());
app.use(router);



app.listen(port, () => {
    console.log(`Server app listening on   http://localhost:${port}`);
});