var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var taskCtrl = require('./controllers/taskController');
var registerCtrl = require('./controllers/registerController');
var loginCtrl = require('./controllers/loginController');

var mongoDBUrl = "mongodb://localhost:27017/exampleDb";
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',taskCtrl);
app.use('/',registerCtrl);
app.use('/',loginCtrl);

MongoClient.connect(mongoDBUrl)
    .then(function (db) {
            console.log("Connected!!!");
            db.collection('users', function(err, collection) {});
            db.collection('tasks', function(err, collection) {});

            db.createCollection('users', function(err, collection) {});
            db.createCollection('tasks', function(err, collection) {});
    })
    .catch(function (err) {
        console.log("Error occurred!");
    });

app.listen(1337, function () {
   console.log('Listening at Port 1337!');
});