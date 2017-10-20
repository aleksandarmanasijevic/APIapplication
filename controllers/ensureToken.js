module.exports = function (req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(401).end('There was an error!');
    }
    // console.log('TOKEN ENSURE!');
    // next();
};
// jwt.verify(bearerToken, 'my_key')
//     .then(function () {
//         next();
//     })
//     .cache(function (err) {
//         res.send(err);
//     });
// }else{
//     res.sendStatus(401).end('There was an error!');
// }