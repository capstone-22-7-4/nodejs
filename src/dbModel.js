var Sequelize = require('sequelize');
const fs = require('fs');
var sequelize = new Sequelize('capstone', 'caps', 'caps74',{
    dialect : 'mysql',
    host : 'localhost',
    prot : 3306,
    pool : {
        max : 10,
        min : 0,
        idle : 10000
    },
    logging : false
});

var user = sequelize.define('users', {
    id : {       type : Sequelize.INTEGER,
                 primaryKey : true,
                 autoIncrement : true },
    email : {    type : Sequelize.STRING,
                 allowNull : false },
    nickname : { type : Sequelize.STRING,
                 allowNull : false },
    name : {     type : Sequelize.STRING,
                 allowNull : false },
    salt_key : { type : Sequelize.STRING(16),
                 allowNull : false },
    password : { type : Sequelize.STRING(64),
                 allowNull : false },
},{ updatedAt : false });

var match = sequelize.define('match', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true },
    madeby : {  type : Sequelize.INTEGER,
                allowNull : false },
    content : { type : Sequelize.JSON,
                allowNull : false }
});

var attend = sequelize.define('room', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true },
    room_id : { type : Sequelize.INTEGER,
                allowNull : false },
    user_id : { type : Sequelize.INTEGER,
                allowNull : false }
},{ updatedAt : false });

user.sync({force:true}).then(() => {console.log('User table connected');
    user.create({
        email : 'first@abcd.efg',
        nickname : 'sample',
        name : 'caps',
        salt_key : 'sampleSalt',
        password : 'ac8d85f18cb8fd8e7f7b4dd0c23cf0a07675b3bf3e491bc62be070ee3699b50d',
    });
});

match.sync({force:true}).then(() => {console.log('Match table connected')});
attend.sync({force:true}).then(() => {console.log('Attend table connected')});

module.exports ={
    users : user,
    match : match,
    attend : attend
};