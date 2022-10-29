const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const fs = require('fs');

const sports_list = fs.readFileSync('./sports.txt', 'utf8').split('\n');

router.get('/mylist', getList);
router.post('/start', postMatch);
router.post('/attend', postAttend);

module.exports = router;

function getList(req,res) {
    const user = req.user.id;
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
    const user = req.user.id;
    const content = req.body;
    if (user){
        db.match.create({
            madeby : user,
            content : content
        }).then((result) => {
            res.status(200).send(content.game + ' Matching Start'); 
        });
    } else res.status(401).send('log in first');
}

function postAttend(req, res) {
    const user = req.user;
    const { room_id } = req.body;
    if (user) {
        db.match.findOne({
            where: { id: room_id },
            attributes: ['content']
        }).then((res_room) => {
            if (res_room) {
                db.attend.findOrCreate({
                    where: { room_id: room_id, user_id: user.id }
                }).then((result) => {
                        res.status(200).send(user.nickname + ' attend ' + res_room.game);
                });
            } else {    res.status(202).send('no room');}
        });
    } else {            res.status(401).send('log in first');}
} 