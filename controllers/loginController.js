var express = require('express');
var passwordHash = require('password-hash');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/exampleDb";
var checkToken = require('./checkToken');
var jwt = require('jsonwebtoken');

router.use('/login', checkToken);

router.post('/login', function (req, res) {
    if(req.body.username !== "" && typeof(req.body.username) !== "undefined" &&
        req.body.password !== "" && typeof(req.body.password) !== "undefined") {

        const dbP = MongoClient.connect(url).then(function (db) {
            return db.collection("users").findOne({username: req.body.username});
        });
        const resP = dbP.then(function (result) {
            if(result != null && passwordHash.verify(req.body.password, result.password)) {
                const tokenData = {
                    username: req.body.username,
                    password: req.body.password
                };
                res.json({token: jwt.sign(tokenData, 'my_key')});
            }else{
                res.end('User with that username or password doesn\'t exists!');
            }
        });
        Promise.all([dbP,resP]).then(function (promises) {
            dbP.close();
        }).catch(function (err) {
            res.sendStatus(500);
            dbP.close();
        });
    }else{
        res.end('There was an error!');
    }
});
module.exports = router;