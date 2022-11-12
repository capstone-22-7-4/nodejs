const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

router.post('/:nickname', report_user);
router.get('/reported', reported);
router.get('/myreport', myreport);

module.exports = router;

function report_user(req,res) {
    var user = req.user;
    const {content} = req.body;
    const target = String(req.params.nickname);
    if(target) {
        if(user.id){
            db.users.findOne({
                where : {nickname:target},
                attributes:['id','report_num']
            }).then((target_res) => {
                if(target_res){
                    db.report.create({
                        target : target_res.id,
                        user_id : user.id,
                        content : content
                    }).then((result) => {
                        db.users.increment({report_num:1},{where:target_res.id})
                        .catch((err) => { 
                                res.status(502).send(err.errors)});
                                res.status(200).send('reported');
                    }).catch((err => {
                        if (err.parent.errno == 1062){
                                res.status(201).send('already reported')
                        } else {
                                res.status(502).send(err.errors)
                        }
                    }));
                } else {        res.status(400).send('no target')}
            }).catch((err)=>{   res.status(502).send(err.errors);});
        } else {                res.status(401).send('log in first');}
    } else {                    res.status(402).send('wrong target');}
}

function reported(req,res) {
    var user = req.user;
    if(user.id){
        db.report.findAll({
            where: { target : user.id },
            attributes : ['content', 'createdAt']
        }).then((results) => {
            res_object = new Object();
            res_object.contents = [];
            results.map((el) => {
               res_object.contents.push(el.content,el.createdAt);
            });
            res_object.number = res_object.contents.length;
                res.status(200).send(res_object);
        }).catch((err) => { 
                res.status(502).send(err.errors);});
    } else {    res.status(401).send('log in first');}
}

function myreport(req,res) {
    var user = req.user;
    if(user.id){
        db.report.findAll({
            where: { user_id : user.id },
            attributes : ['content', 'createdAt']
        }).then((results) => {
            res_object = new Object();
            res_object.contents = [];
            results.map((el) => {
               res_object.contents.push(el.content,el.createdAt);
            });
            res_object.number = res_object.contents.length;
                res.status(200).send(res_object);
        }).catch((err) => { 
                res.status(502).send(err.errors);});
    } else {    res.status(401).send('log in first');}
}