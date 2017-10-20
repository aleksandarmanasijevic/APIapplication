module.exports = function (req, res, next) {
    console.log(JSON.stringify(req.headers));
    const bearerHeader = req.headers["authorization"];
    // if user doesn't have token
    if(typeof bearerHeader === 'undefined'){
        console.log('Don\'t have token and I can register!');
        next();
    }else{
        console.log('I have token!' + req.headers["authorization"]);
        res.sendStatus(500).end('You have token!');    // user can't register if he already have token
    }
};