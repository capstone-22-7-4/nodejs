const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
require('dotenv').config()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}));

const verifyToken = (req,res,next) => {
    try{
        const cookies = cookie.parse(req.headers.cookie);
        const userData = jwt.verify(cookies.user, process.env.SECRET_KEY);
        req.user = userData
    }
    catch (error){}
    next()
};

app.use(verifyToken);
app.use('/user', require('./userkp'));
app.use('/match', require('./matchkp'));
app.use('/class', require('./classkp'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});