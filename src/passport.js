const LocalStrategy = require('passport-local').Strategy;
const mydb = require('./dbModel')
const crypto = require('crypto');

module.exports = (passport) => {
    var strategy = new LocalStrategy({
        usernameField:'email',
        passwordField:'pw',
    },login);
    
    passport.use(strategy);
    passport.serializeUser(function(user_info, done){
        console.log(user_info.id,'log in session');
        done(null, user_info.id);
    });
    
    passport.deserializeUser(function(user_info,done) {
        console.log('read user info');
        done(null,user_info);
    });   
}

function login(email,pw, done){    
    var user_info = new Object();
    mydb.users.findOne({
        where: {email : email},
        attributes: ['id','salt_key', 'password', 'nickname']
    })
    .then((results, rejected) => {
        if(rejected){
            console.log(`rejected ${rejected}`);
            return done(err);
        }
        if (!results){
            return done(null,false, { message : 'Incorrect id'});
        } 

        const valid = crypto
        .createHash('sha256')
        .update(pw+results.salt_key)
        .digest('hex')
        if(!(results.password === valid)){
            return done(null,false, { message : 'Incorrect pw'});
        }
        user_info.id = results.id;
        user_info.nickname = results.nickname;

        return done(null, user_info);
    });
}