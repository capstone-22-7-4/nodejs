const router = require('express').Router();
const mydb = require('./dbModel');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const crypto = require('crypto');
const Op = require('sequelize').Op;

router.post('/login', login);
router.get('/islogin', islogin);
router.post('/signup', signup);
router.delete('/signout', signout);

router.get('/list', getlist);
router.get('/detail',getdetail);

module.exports = router;


function login(req,res){
    const {email, pw} = req.body;
    // const expire_time = 60*60*24*7    
    var user_info = new Object();
    mydb.users.findOne({
        where: {email: email},
        attributes: ['id','salt_key','password','nickname']
    }).then((results, rejected) => {
        if(rejected){
            res.status(404).send(rejected);
            return;
        }
        if (!results){
            res.status(404).send('no user');
            return;
        }
        const valid = crypto
        .createHash('sha256')
        .update(pw+results.salt_key)
        .digest('hex')
        if(!(results.password === valid)){
            res.status(404).send('no user');
            return;
        }
        user_info.id = results.id;
        user_info.nickname = results.nickname;
        const token = jwt.sign(
            user_info, 
            process.env.SECRET_KEY,
            // { expiresIn: expire_time }
        );
        res.cookie('user',token, 
            // {maxAge:expire_time}
        );
        res.status(200).json({
            result: 'ok',
            jwt: token
        })
    })
}

function islogin(req,res){
    const user = req.user;
    if (user.id)   res.status(200).send(true);
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
    const user = req.user;
    if(user.id){
        mydb.users.destroy({where:{id:user.id}});
        req.status(200).cookie('user', "").send('sign out');
    } else {
        res.status(401).send('log in first');
    }
}

function getdetail(req,res){
    const user = req.user;
    if (user.id){
        mydb.users.findOne({
            where: {id : user.id},
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