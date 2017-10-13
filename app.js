var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

var mongoDBUrl = "mongodb://localhost:27017/exampleDb";
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

router.post('/register', function (req, response) {
    console.log(JSON.stringify(req.body));
    // username, password, fullname shouldn't be empty strings
    if(req.body.username != "" && typeof(req.body.username) != "undefined" &&
        req.body.password != "" && typeof(req.body.password) != "undefined" &&
        req.body.fullname != "" && typeof(req.body.fullname) != "undefined")
    {
        // username shouldn't be taken
        // if(username){
        //    ADD to DB
        response.end('User added to DB ' + JSON.stringify(req.body));
        // }else{
        //     response.end('The username is already taken');
        // }
    }else{
        response.end('There was an error!');
    }
});

router.post('/login', function (req, response) {
    console.log(JSON.stringify(req.body));
    // username, password shouldn't be empty strings
    if(req.body.username != "" && typeof(req.body.username) != "undefined" &&
        req.body.password != "" && typeof(req.body.password) != "undefined")// && username == DB.username && password == DB.password
    {
        //

        response.end('You are logged in ');
    }else{
        response.end('There was an error!');
    }
});

// MongoClient.connect(mongoDBUrl, function(err, db) {
//     if(!err) {
//         console.log("Connected!!!");
//     }
//     db.collection('users', function(err, collection) {});
//
//     db.collection('tasks', {w:1}, function(err, collection) {});
//
//     db.createCollection('users', function(err, collection) {});
//
//     db.createCollection('tasks', {w:1}, function(err, collection) {});
// });

app.listen(1337, function () {
   console.log('Listening at Port 1337!');
});