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
    id : {          type : Sequelize.INTEGER,
                    primaryKey : true,
                    autoIncrement : true },
    email : {       type : Sequelize.STRING,
                    allowNull : false },
    nickname : {    type : Sequelize.STRING,
                    allowNull : false },
    name : {        type : Sequelize.STRING,
                    allowNull : false },
    salt_key : {    type : Sequelize.STRING(16),
                    allowNull : false },
    password : {    type : Sequelize.STRING(64),
                    allowNull : false },
    report_num : {  type : Sequelize.INTEGER,
                    defaultValue : 0  }
},{ updatedAt : false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

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
                allowNull : true }
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
},{ updatedAt : false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

var gosu = sequelize.define('gosu', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true, 
                autoIncrement : true },
    game : {    type : Sequelize.STRING,
                allowNull : false },
    user_id : { type : Sequelize.INTEGER,
                allowNull : false },
    content : { type : Sequelize.JSON,
                allowNull : true }
},{ updatedAt : false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

var gosu_class = sequelize.define('class', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true },
    madeby : {  type : Sequelize.INTEGER,
                allowNull : false },
    game : {    type : Sequelize.STRING,
                allowNull : false },
    nickname : {type : Sequelize.STRING,
                allowNull : false },
    lati : {    type : Sequelize.STRING,
                allowNull : false },
    longi : {   type : Sequelize.STRING,
                allowNull : false },
    limit : {   type : Sequelize.INTEGER,
                allowNull : false },
    content : { type : Sequelize.JSON,
                allowNull : true }
},{
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

var chobo = sequelize.define('chobo', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true },
    room_id : { type : Sequelize.INTEGER,
                allowNull : false },
    user_id : { type : Sequelize.INTEGER,
                allowNull : true },
    nickname : {type : Sequelize.STRING,
                allowNull : false }
},{
    updatedAt: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

var report_log = sequelize.define('reportlog', {
    user_id : { type : Sequelize.INTEGER,
                primaryKey : true,
                allowNull : false },
    target : {  type : Sequelize.INTEGER,
                primaryKey : true,
                allowNull : false },
    content : { type : Sequelize.STRING,
                allowNull : false }
},{
    updatedAt: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

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
gosu.sync({force:true}).then(() => {console.log('Gosu table connected');});
gosu_class.sync({force:true}).then(() => {console.log('Class table connected');});
chobo.sync({force:true}).then(() => {console.log('Chobo table connected');});
report_log.sync({force:true}).then(() => {console.log('Report Log table connected')})

module.exports ={
    users : user,
    match : match,
    attend : attend,
    gosu : gosu,
    g_class : gosu_class,
    chobo : chobo,
    report : report_log
};