const express = require('express');
const router = express.Router();

const db = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

router.get('/list', getList);

module.exports = router;

function getList(req,res) {
    var user = req.user;
    if(user){
        
    } else { res.status(401).send('login first'); }
}