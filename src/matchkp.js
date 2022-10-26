const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const fs = require('fs');

const sports_list = fs.readFileSync('./sports.txt', 'utf8').split('\n');

router.get('/mylist', getList);
router.post('/start', postMatch);

module.exports = router;

function getList(req,res) {
    var user = req.user;
    if(user){
        db.match.findAll({
            where: { madeby : user },
            attributes : ['content', 'createdAt', 'updatedAt']
        }).then((results) => {
            console.log(results);
            res.status(200).send(results);
        });
    } else res.status(401).send('log in first');
}

function postMatch(req,res) {
    var user = req.user;
    const content = req.body;
    console.log(content);
    if (user){
        db.match.create({
            madeby : user,
            content : content
        }).then((result) => {
            res.status(200).send(content.game + ' Matching Start'); 
        });
    } else res.status(401).send('log in first');
}