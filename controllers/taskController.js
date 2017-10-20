var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var ensureToken = require('./ensureToken');
var jwt = require('jsonwebtoken');
const user = require('./getUsernameFromToken');
const url = "mongodb://localhost:27017/exampleDb";
router.use('/task', ensureToken);

// GET all tasks
router.get('/task', function (req, res) {
    console.log('GET all tasks for user ' +  user(req));
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
            return db.collection("tasks").find({username: user(req)}).toArray();
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function () {
            res.sendStatus(500);
            console.log('Error occurred!');
        });
});
// GET a specific task
router.get('/task/:task_id', function (req, res) {
    const tempID = new ObjectID(req.params["task_id"]);
    MongoClient.connect(url)
        .then(function (db) {
            return db.collection("tasks").findOne({_id: tempID, username: user(req)});
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function () {
            res.sendStatus(500);
            console.log('Error occurred!');
        });
});
// POST new task
router.post('/task', function (req, res) {
    const newTask = {username: user(req),name: req.body.name, description: req.body.description, completed: false};
    MongoClient.connect(url)
        .then(function (db) {
            return db.collection("tasks").insertOne(newTask);
        })
        .then(function () {
            res.end('New task added!');
        })
        .catch(function () {
            res.sendStatus(500);
        });
});
// PUT specific task
router.put('/task/:task_id', function (req, res) {
    const newvalues = { $set: { completed: true } };
    const tempID = new ObjectID(req.params["task_id"]);
    const query = { _id: tempID, username: user(req)};
    const dbP = MongoClient.connect(url);
    const resP = dbP.then(function (db) {
        return db.collection("tasks").updateOne(query, newvalues);
    });
    Promise.all([dbP, resP]).then(function (promises) {
        if(promises[1] !== null){
            res.end('Task updated!' + req.params["task_id"] );
        }else{
            throw new Error('There was an error!');
        }
    });
});
// DELETE specific task the user is right
router.delete('/task/:task_id', function (req, res) {
    console.log(user(req));
    const tempID = new ObjectID(req.params["task_id"]);
    MongoClient.connect(url)
        .then(function (db) {
            return db.collection("tasks").deleteOne({_id: tempID});
        })
        .then(function (result) {
            console.log(result);
            res.json(result);
        })
        .catch(function (err) {
            console.log(err);
            console.log('Error occurred!');
        });
});
module.exports = router;