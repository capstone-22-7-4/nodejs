const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const fs = require('fs');

const sports_list = fs.readFileSync('./sports.txt', 'utf8').split('\n');

router.get('/mylist', getMyList);
router.get('/all:offset', getAllList);
router.get('/list:game', getGameList);
router.get('/attend:room', getAttend);
router.delete('/attend:room', deleteAttend);
router.get('/part:room', getAttendNum);
router.post('/start', postMatch);

module.exports = router;

function getAttendNum(req,res) {
    const room_id = Number(req.params.room)
    if(room_id){
        db.attend.count({
            where : { room_id: room_id}
        }).then((result) => {
            res.status(200).send(String(result))
        });
    } else res.status(401).send('put integer');
}

function getGameList(req,res) {
    const limit = 10;
    db.match.findAll({
        where: { game : req.params.game },
        attributes: ['id','game','lati','longi','content']
    }).then((results) => {
        res.status(200).send(results);
    });
}

function getAllList(req,res) {
    const limit = 10;
    db.match.findAll({
        attributes: ['id','game','content'],
        offset: Number(req.params.offset)*limit || 0,
        limit: limit,
        subQuery: false
    }).then((results) => {
        res.status(200).send(results);
    });
}

function getMyList(req,res) {
    const user = req.user;
    if(user){
        db.match.findAll({
            where: { madeby : user.id },
            attributes : ['id','game','lati','longi','createdAt','updatedAt']
        }).then((results) => {
            // var contents = new Array();
            // for (const temp of results){
            //     contents.push(temp.content)
            // }
            // res.status(200).send(contents);
                res.status(200).send(results);
        });
    } else {    res.status(401).send('log in first');}
}

function postMatch(req,res) {
    const user = req.user;
    const {game, lati, longi, content} = req.body;
    if (user){
        db.match.create({
            madeby : user.id,
            game : game,
            lati : lati,
            longi : longi,
            content : content
        }).then((result) => {
            db.attend.create({
                room_id: result.id, 
                user_id: user.id
            }).then((res_room) => {
                res.status(200).send(game + ' Matching Start in room '+res_room.room_id); 
            });
        });
    } else {    res.status(401).send('log in first');}
}

function getAttend(req, res) {
    const user = req.user;
    const room_id = Number(req.params.room)
    if (!room_id){
        res.status(402).send('put integer');
        return;
    }
    if (user.id) {
        db.match.findOne({
            where: { id: room_id },
            attributes: ['game','content']
        }).then((res_room) => {
            if (res_room) {
                db.attend.findOrCreate({
                    where: { room_id: room_id, user_id: user.id }
                }).then((result) => {
                        res.status(200).json(user.nickname + ' attend ' + res_room.game);
                });
            } else {    res.status(202).send('no room');}
        });
    } else {            res.status(401).send('log in first');}
} 

function deleteAttend(req,res) {
    const user = req.user;
    const room_id = Number(req.params.room)
    if (!room_id){
        res.status(402).send('put integer');
        return;
    }
    if (user.id) {
        db.attend.findOne({
            where: { id: room_id, user_id:user.id},
        }).then((result) => {
            if (result) {
                db.match.findOne({
                    where: {id : room_id},
                    attributes: ['madeby']
                }).then((room_res) => {
                    if(room_res.madeby === user.id){
                        db.attend.destroy({where:{id:room_id}});
                        res.status(200).send(user.nickname + ' deleted on room ' + room_id);
                    } else {
                        db.attend.destroy({where:{id:room_id, user_id:user.id}});
                        res.status(200).send('room ' + room_id + ' is deleted');
                    }
                });
            } else {    res.status(202).send('already deleted');}
        });
    } else {            res.stauts(401).send('log in first');}
}