var express = require('express');
var router = express.Router();

// GET all tasks
router.get('/task', function (req, resp) {
    resp.end('Get them all!');
});
// GET a specific task
router.get('/task/:task_id', function (req, resp) {
    resp.end('Get the specific task! ' + req.params.task_id);
});
// POST all tasks
router.post('/task', function (req, resp) {
    resp.end('POST task! ' + req.body.name + ' ' + req.body.description + ' ' + req.body.completed);
});
// PUT all tasks
router.put('/task/:task_id', function (req, resp) {
    resp.end('PUT task!' + req.params.task_id);
});
module.exports = router;