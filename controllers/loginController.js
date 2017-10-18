var express = require('express');
var router = express.Router();
// GET all tasks
router.post('/login', function (req, resp) {
    resp.end('Hello login! ' + req.body.username + ' ' + req.body.password);
});
module.exports = router;