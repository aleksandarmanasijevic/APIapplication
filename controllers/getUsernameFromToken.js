const jwt = require('jsonwebtoken');

module.exports = function (req) {
    const signedObj = jwt.verify(req.token, 'my_key');
    return signedObj["username"];
};