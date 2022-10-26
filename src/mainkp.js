var express = require('express');
var app = express();
const PORT = 8880;

var bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}));

const session = require('express-session');
const passport = require('passport');
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'secret key'
}));

require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', require('./userkp'));
app.use('/match', require('./matchkp'));
app.use('/class', require('./classkp'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});