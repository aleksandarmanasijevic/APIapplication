var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/exampleDb";
var jwt = require('jsonwebtoken');
var checkToken = require('./checkToken');

router.use('/register', checkToken);

router.post('/register', function (req, res) {
    if(req.body.username !== "" && typeof(req.body.username) !== "undefined" &&
        req.body.password !== "" && typeof(req.body.password) !== "undefined" &&
        req.body.fullname !== "" && typeof(req.body.fullname) !== "undefined") {

        const myobj = { username: req.body.username, password: passwordHash.generate(req.body.password), fullname: req.body.fullname };
        const dbP = MongoClient.connect(url);
        const dbResultP = dbP.then(function (db) {
            return db.collection("users").findOne({username: req.body.username})
        });
        const userP = Promise.all([dbP, dbResultP]).then(function (promises) {
            if(promises[1] == null){
                return promises[0].collection("users").insertOne(myobj);
            }else{
                res.status(500).end('There was an error!');
                throw new Error('There was an error!');
            }
        });
        Promise.all([dbP, dbResultP, userP]).then(function (promises) {
            const tokenData = {
                username: req.body.username,
                password: req.body.password
            };
            res.json({token: jwt.sign(tokenData, 'my_key')});
            promises[0].close();
        }).catch(function () {
            res.end('There was an error!');
        });
    }else{
        res.end('Invald parameters!');
    }
});
module.exports = router;
