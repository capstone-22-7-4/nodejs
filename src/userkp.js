const router = require('express').Router();
const mydb = require('./dbModel');
const passport = require('passport');

const crypto = require('crypto');
const Op = require('sequelize').Op;

router.get('/islogin', islogin);
router.post('/signup', signup);
router.delete('/signout', signout);
router.post('/login',passport.authenticate('local'), 
    (req,res) => { 
        delete req.user.id;
        res.send(req.user); });
router.get('/logout', (req, res) => {
    req.logOut();
    req.session.save(err =>{
        if(err) throw err;
        res.status(200).send('logout');
    });
});

router.get('/list', getlist);
router.get('/detail',getdetail);

module.exports = router;

function islogin(req,res){
    var user = req.user;
    if (user)   res.status(200).send(true);
    else        res.status(202).send(false);
}

function signup(req,res){
    const {email, pw, name, nickname} = req.body;
    if(email && pw && name && nickname){
        const salt = crypto.randomBytes(10).toString('base64');
        const hash_pw = crypto
        .createHash('sha256')
        .update(pw + salt)
        .digest('hex');

        mydb.users.findOrCreate({
            where: {
                [Op.or] : [{email : email}, {nickname : nickname}] 
            },
            attributes: ['nickname', 'email'],
            defaults:{
                email : email,
                nickname : nickname,
                name : name,
                salt_key: salt,
                password :hash_pw,
            }
        }).then((results) =>{
            if(!results[1]){
                if ( email == results[0].dataValues.email)
                    res.status(202).send(`email ${email} is already exists`);
                else if ( nickname == results[0].dataValues.email)
                    res.status(202).send(`nickname ${nickname} is already exists`);
                else res.status(202).send(`something wrong in signup`);
            }
            else {
                res.status(200).send(`${email} has been created.`);
                console.log(`ip : ${req.ip}\ncreate ${email}`);
            }
        });
    } else {
        res.status(404).send('Please fill it up');
    }
}

function signout(req,res){
    var user = req.user;
    if(user){
        mydb.users.destroy({where:{id:user}});
        req.logOut();
        req.session.save(err =>{
            if(err) throw err;
            res.status(200).send('sign out');
        });
    } else {
        res.status(401).send('log in first');
    }
}

function getdetail(req,res){
    var user = req.user;
    if (user){
        mydb.users.findOne({
            where: {id : user},
            attributes: ['nickname', 'email']
        })
        .then((results, rejected) => {
            if(results)
                res.status(200).send(results.dataValues);
            else
                res.status(201).send(results);
        });
    } else {
        res.status(401).send('log in first');
    }
}

function getlist(req, res){
    mydb.users.findAll({
            attributes : ['email','nickname']
        }).then(
        (results) => {
            console.log('list request');
            res.status(200).send(results);}, 
        (rejected) =>{
            console.log('selection fail'+rejected);
            res.status(400).send('list not found');
    });
}