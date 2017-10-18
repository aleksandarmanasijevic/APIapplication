var express = require('express');
var router = express.Router();
// GET all tasks
router.post('/register', function (req, resp) {
    resp.end('Hello register! ' + req.body.username + ' ' + req.body.password + ' ' + req.body.fullname);
});
module.exports = router;