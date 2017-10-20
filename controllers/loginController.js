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

        MongoClient.connect(url)
            .then(function (db) { // <- db as first arg
                db.collection("users").findOne({username: req.body.username})
                    .then(function (result) { // <- db as first argument
                        if(result != null && passwordHash.verify(req.body.password, result.password)) {
                            const tokenData = {
                                username: req.body.username,
                                password: req.body.password
                            };
                            res.json({token: jwt.sign(tokenData, 'my_key')});
                            console.log(jwt.verify(jwt.sign(tokenData, 'my_key'), 'my_key'));
                        }else{
                            // user doesn't exist
                            res.end('User doesn\'t exists!');
                        }
                        db.close();
                    })
                    .catch(function (err) {
                        res.end('There was an error!' + err);
                        db.close();
                    })
            })
            .catch(function (err) {
                res.end('There was an error!');
            })
    }else{
        res.end('There was an error!');
    }
});
module.exports = router;