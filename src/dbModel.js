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
    timezone: "+09:00",
    dialectOptions: {
        charset: "utf8mb4",
        dateStrings: true,
        typeCast: true,
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
    game : {    type : Sequelize.STRING,
                allowNull :false },
    lati : {    type : Sequelize.STRING,
                allowNull : false },
    longi : {   type : Sequelize.STRING,
                allowNull : false },
    content : { type : Sequelize.JSON,
                allowNull : false }
},{
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

var attend = sequelize.define('room', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true },
    room_id : { type : Sequelize.INTEGER,
                allowNull : false },
    user_id : { type : Sequelize.INTEGER,
                allowNull : false },
    nickname : {type : Sequelize.STRING,
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

match.sync({force:true}).then(() => {console.log('Match table connected');
    match.create({
       madeby : 1,
       game : "농구",
       lati :  "37.50423495445599",
       longi: "126.95743066324361",
       content: {
           "limit": "2022-11-05 22:00"
       }
    });
});
attend.sync({force:true}).then(() => {console.log('Attend table connected');
    attend.create({
        room_id : 1,
        user_id : 1,
        nickname : "sample"
    });
});

module.exports ={
    users : user,
    match : match,
    attend : attend
};