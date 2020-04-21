const express = require('express');
const mongoose = require('mongoose');


const login = require('./controllers/login');
const register = require('./controllers/register');
const logout = require('./controllers/logout');
const index = require('./controllers/index');
const profile = require('./controllers/profile');
const addFilm = require('./controllers/addFilm');
const match = require('./controllers/match');


var firebase = require("firebase");


var config = {

};
firebase.initializeApp(config);

var fileUpload = require('express-fileupload');
var fs = require('fs');
var formidable = require('formidable');

var multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
app.use(fileUpload());
app.set('view engine','ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser);

var ref = firebase.database().ref("Users");

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
});
var User = mongoose.model('User',userSchema);

var curUser = new mongoose.Schema({
    username:String,
});
curUser.username = "guest";

var FilmsSchema = new mongoose.Schema({
    id: String,
    watchType: Number,
    username: String,
});
var WatchFilm = mongoose.model("WatchFilm", FilmsSchema);

app.use(express.static(__dirname + '/views/public'));

var request=require('request');
var apiKey = "";

//////////////////////////////////////////////////////////////////////////////////////////

login(curUser, ref, app);
register(firebase, ref, app);
logout(curUser, app);
index(curUser, app);
addFilm(curUser, ref, app);
match(curUser, request, ref, firebase, app);
profile(curUser, app);

if(process.env.PORT == null){
    app.listen(3000,function(){
        console.log("Connected");
    });
}else{
    app.listen(process.env.PORT, "0.0.0.0",function(){
        console.log("Connected");
    });
}
