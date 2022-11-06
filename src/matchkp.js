const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const fs = require('fs');

const sports_list = fs.readFileSync('./sports.txt', 'utf8').split('\n');

router.post('/start', postMatch);
router.get('/attend:room', getAttend);
router.delete('/attend:room', deleteAttend);
router.get('/part:room', getAttendNum);

router.get('/all:offset', getAllList);
router.get('/mylist', getMyList);
router.get('/list:game', getGameList);

module.exports = router;

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
                user_id: user.id,
                nickname : user.nickname
            }).then((res_room) => {
                res.status(200).send(String(res_room.room_id)); 
            });
        });
    } else {    res.status(401).send('log in first');}
}

function getAttend(req, res) {
    const user = req.user;
    const room_id = Number(req.params.room);
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
                    where: { room_id: room_id, user_id: user.id, nickname: user.nickname }
                }).then((result) => {
                        res.status(200).send(user.nickname + ' attend ' + res_room.game);
                });
            } else {    res.status(202).send('no room');}
        });
    } else {            res.status(401).send('log in first');}
} 

function deleteAttend(req,res) {
    const user = req.user;
    const room_id = Number(req.params.room);
    if (!room_id){
        res.status(402).send('put integer');
        return;
    }
    if (user.id) {
        db.match.findOne({
            where: {id: room_id},
            attributes: ['madeby']
        }).then((room_res) => {
            if(room_res){
                db.attend.findOne({
                    where: {room_id: room_id, user_id: user.id}
                }).then((attend_res) => {
                    if(attend_res){
                        if(room_res.madeby === user.id){
                            db.attend.destroy({where:{room_id:room_id}});
                            db.match.destroy({where:{id:room_id}})
                                res.status(200).send('delete room ' + room_id);
                        } else {
                            db.attend.destroy({where:{room_id:room_id,user_id:user.id}});
                                res.status(200).send("cancel participation");
                        }
                    } else {    res.status(202).send("already deleted");}
                });
            } else {            res.status(202).send("no room");}
        });
    } else {                    res.status(401).send('log in first');}
}

function getAttendNum(req,res) {
    const room_id = Number(req.params.room);
    if(room_id){
        db.match.findOne({
            where: {id: room_id},
            attributes: ['content']
        }).then((room_res) => {
            if(room_res){
                db.attend.findAll({
                    where: {room_id:room_id},
                    attributes: ['nickname','createdAt']
                }).then((room_res) => {
                    result = new Object();
                    result.list = [];
                    room_res.map((el) => {
                        result.list.push(el.nickname,el.createdAt);
                    });
                    result.number = result.list.length;
                        res.status(200).send(result);
                });
            } else {    res.status(202).send("no room");}
        });
    } else {            res.status(401).send('put integer');}
}

function getAllList(req,res) {
    const offset = Number(req.params.offset) || 0;
    if (offset != undefined) {
        const limit = 10;
        db.match.findAll({
            attributes: ['id','game','lati','longi','content','createdAt'],
            offset: offset*limit || 0,
            limit: limit,
            subQuery: false
        }).then((results) => {
                res.status(200).send(results);
        });
    } else {    res.status(401).send('put integer');}
}

function getMyList(req,res) {
    const user = req.user;
    if(user){
        db.match.findAll({
            where: { madeby : user.id },
            attributes : ['id','game','lati','longi','content','createdAt']
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

function getGameList(req,res) {
    const limit = 10;
    db.match.findAll({
        where: { game : req.params.game },
        attributes: ['id','game','lati','longi','content','createdAt']
    }).then((results) => {
        res.status(200).send(results);
    });
}
