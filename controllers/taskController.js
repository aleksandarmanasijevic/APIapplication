var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ensureToken = require('./ensureToken');
var jwt = require('jsonwebtoken');
const url = "mongodb://localhost:27017/exampleDb";

router.use('/task', ensureToken);

// GET all tasks
router.get('/task', function (req, res) {
    console.log(req.token);
    const jwtVerifyPromise = new Promise(function (resolve, reject) {
        jwt.verify(req.token, 'my_key', function(err, decoded) {
            if(err){
                reject(err);
            }else{
                resolve(decoded);
            }
        });
    });
    jwtVerifyPromise
        .then(function () {
            return MongoClient.connect(url);
        })
        .then(function (db) {
            return db.collection("users").find({}).toArray();
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function () {
            res.sendStatus(500);
            console.log('Catch ');
        });
});
// GET a specific task
router.get('/task/:task_id', function (req, res) {
    res.end('Get the specific task! ' + req.params.task_id);
});
// POST all tasks
router.post('/task', function (req, res) {
    res.end('POST task! ' + req.body.name + ' ' + req.body.description + ' ' + req.body.completed);
});
// PUT all tasks
router.put('/task/:task_id', function (req, res) {
    res.end('PUT task!' + req.params.task_id);
});
module.exports = router;