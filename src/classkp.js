const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

router.post('/register', postRegist);
router.post('/start', postClass);
router.get('/attend:room', getAttend);
router.delete('/attend:room', deleteAttend);
router.get('/part:room', getAttendNum);

router.get('/all:offset', getAllList);
router.get('/mylist', getMyList);
router.get('/list:game', getGameList);

module.exports = router;

function postRegist(req,res) {
    const {game, content} = req.body;
    var user = req.user;
    if(user){
        db.gosu.create({
            game : game,
            user_id : user.id,
            content : content
        }).then((result) => {
                res.status(200).send(user.nickname + " is registered as " + game + " gosu");
        }).catch((err) => {
                res.status(502).send(err.errors);});
    } else {    res.status(401).send('log in first');}
}

function postClass(req,res) {
    var user = req.user;
    const {game, lati, longi, limit, content} = req.body;
    if(user){
        db.gosu.findOne({
            where : { user_id:user.id, game:game },
            attributes: ['content']
        }).then((gosu_res) => {
            if(gosu_res){
                db.g_class.create({
                    madeby : user.id,
                    game : game,
                    nickname : user.nickname,
                    lati : lati,
                    longi : longi,
                    limit : limit,
                    content : content
                }).then((result) => {
                        res.status(200).send(String(result.id));
                }).catch((err) => {
                        res.status(502).send(err.errors);});
            } else {    res.status(402).send('register gosu first')}
        }).catch((err) => {
                        res.status(502).send(err.errors);});
    } else {            res.status(401).send('log in first');}
}

function getAttend(req,res) {
    var user = req.user;
    const room_id = Number(req.params.room);
    if (room_id){
        if (user.id) {
            db.g_class.findOne({
                where: {id: room_id},
                attributes: ['game', 'madeby']
            }).then((res_room) => {
                if(res_room){
                    if(res_room.madeby != user.id){
                        db.chobo.findOrCreate({
                            where: {room_id:room_id,user_id:user.id,nickname:user.nickname}
                        }).then((res_chobo) => {
                            res.status(200).send(user.nickname+ ' attend ' +res_room.game);
                        }).catch((err) => {
                            res.status(502).send(err.errors);});
                    } else {res.status(401).send('your class');}
                } else {    res.status(202).send('no room');}
            }).catch((err) => {
                            res.status(502).send(err.errors);});
        } else {            res.status(401).send('log in first');}
    } else {                res.status(402).send('put integer');}
}

function deleteAttend(req,res) {
    const user = req.user;
    const room_id = Number(req.params.room);
    if (room_id){
        if (user.id) {
            db.g_class.findOne({
                where: {id:room_id},
                attributes: ['madeby']
            }).then((room_res) => {
                if(room_res.madeby == user.id){
                    db.chobo.destroy({where:{room_id:room_id}});
                    db.g_class.destroy({where:{id:room_id}});
                                    res.status(200).send('delete room '+room_id);
                } else if (room_res){
                    db.chobo.findOne({
                        where: {room_id:room_id,user_id:user.id}
                    }).then((attend_res) => {
                        if(attend_res){
                            db.chobo.destroy({where:{room_id:room_id,user_id:user.id}});
                                    res.status(200).send("cancel participation");
                        } else {    res.status(202).send("already deleted");}
                    }).catch((err) => {
                                    res.status(502).send(err.errors);});
                } else {            res.status(202).send("no room");}
            }).catch((err) => {
                                    res.status(502).send(err.errors);});
        } else {                    res.status(401).send('log in first');}
    } else {                        res.status(402).send('put integer');}
}

function getAttendNum(req,res) {
    const room_id = Number(req.params.room);
    if(room_id){
        db.g_class.findOne({
            where: {id:room_id},
            attributes: ['content']  
        }).then((room_res) => {
            if(room_res){
                db.chobo.findAll({
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
                }).catch((err) => {
                        res.status(502).send(err.errors);});
            } else {    res.status(202).send("no room");}
        }).catch((err) => {
                        res.status(502).send(err.errors);});
    } else {            res.status(401).send('put integer');}
}

function getAllList(req,res) {
    const offset = Number(req.params.offset) || 0;
    if (offset != undefined) {
        const limit = 10;
        db.g_class.findAll({
            attributes: ['id','game','lati','longi','limit','content','createdAt'],
            offset: offset*limit || 0,
            limit: limit,
            subQuery: false
        }).then((results) => {
                res.status(200).send(results);
        }).catch((err) => {
                res.status(502).send(err.errors);});
    } else {    res.status(401).send('put integer');}
}

function getMyList(req,res) {
    const user = req.user;
    if (user.id) {
        db.g_class.findAll({
            where: { madeby : user.id },
            attributes : ['id','game','lati','longi','limit','content','createdAt']
        }).then((results) => {
            // var contents = new Array();
            // for (const temp of results){
            //     contents.push(temp.content)
            // }
            // res.status(200).send(contents);
                res.status(200).send(results);
        }).catch((err) => {
                res.status(502).send(err.errors);});
    } else {    res.status(401).send('log in first');}
}

function getGameList(req,res) {
    db.match.findAll({
        where: { game : req.params.game },
        attributes: ['id','game','lati','longi','limit','content','createdAt']
    }).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        res.status(502).send(err.errors);});
}