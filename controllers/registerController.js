var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/exampleDb";
var jwt = require('jsonwebtoken');
var checkToken = require('./checkToken');

router.use('/register', checkToken);

router.post('/register', function (req, res) {
    if(req.body.username != "" && typeof(req.body.username) != "undefined" &&
        req.body.password != "" && typeof(req.body.password) != "undefined" &&
        req.body.fullname != "" && typeof(req.body.fullname) != "undefined") {

        MongoClient.connect(url)
            .then(function (db) { // <- db as first arg
                const myobj = { username: req.body.username, password: passwordHash.generate(req.body.password), fullname: req.body.fullname };

                db.collection("users").findOne({username: req.body.username})
                    .then(function (result) { // <- db as first argument
                        if(result == null) {
                            db.collection("users").insertOne(myobj)
                                .then(function (result) {
                                    const tokenData = {
                                        username: myobj.username,
                                        password: myobj.password
                                    };
                                     res.status(200).json({token: jwt.sign(tokenData, 'my_key')});
                                     console.log(jwt.sign(tokenData, 'my_key'));
                                    db.close();
                                })
                                .catch(function (err) {
                                    res.status(500).end('There was an error!');
                                    db.close();
                                });
                        }else{
                            res.status(500).end('Username already exists!');
                            db.close();
                        }
                    })
                    .catch(function (err) {
                        res.end('There was an error!');
                        db.close();
                    });
            })
            .catch(function (err) {
                res.end('DB connection error!');
                db.close();
            });
    }else{
        res.end('Invald parameters!');
    }
});
module.exports = router;


// return db.collection("users").findOne({username: req.body.username})
// }).then(result
