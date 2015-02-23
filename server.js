// Adam testing git is working on the VPS
// Were also not using Python hahaha no #####
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer(),
    uuid = require('node-uuid');
// Setting server dependancys
server.use(restify.CORS({
    origins: ['*'], // defaults to ['*']
    credentials: true, // defaults to false
    headers: ['authorization', 'content-type', 'accept', 'origin'],
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'] // sets expose-headers
}));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());
restify.CORS.ALLOW_HEADERS.push('authorization');
// Creating Server
server.listen(8080, function() {
    console.log('Incoming request being handled.');
    // The way this works is by having there name in at the moment e.g DOMAIN/checkin?user=USERNAME&location=7817587295719 This will then add 10 points at the moment
    server.put("/checkin", function(req, res, next) {
        // Get user and set couchdb url
        var user = req.query.user,
            points = parseInt(req.query.points),
            url = 'http://localhost:5984/users/' + user;
        console.log('CHECKIN ');
        console.log('PUT ' + user);
        // checks to see if the username is the same as the one in the URL 
        if(user != req.authorization.basic.username) {
            return next(new restify.ForbiddenError('You cant access that user.'));
        }
        // checks it contains  content type application/json
        if(req.headers['content-type'] != 'application/json') {
            return next(new restify.UnsupportedMediaTypeError('Bad Content-Type.'));
        }
        // checks if it has basic authorization
        if(req.authorization.scheme != 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required.'));
        }
        console.log('Parameters supplied.');
        request.get(url, function(err, response, body) {
            console.log("Request started.")
            // if the document isnt found it will create it from sratch
            if(response.statusCode == 404) {
                return next(new restify.ForbiddenError('User Not Found'));
            };
            if(response.statusCode == 200) {
                console.log('Existing document.');
                body = JSON.parse(body);
                var pwd = sha1(req.authorization.basic.password + body.salt);
                if(pwd != body.password) {
                    return next(new restify.ForbiddenError('Invalid username/password.'));
                }
                console.log('Passwords match!');
                var d = new Date(),
                    date = d.toUTCString();
                // change what we need in the body e.g the points can probably add to the array aswell
                body.last_modified = date;
                body.points = body.points + points;
                // adding the transactions to the array so we can keep track of them
                body.transactions.push({transactionid: uuid.v1(), date: date, amount_of_points: points})
                console.log(body.points);
                var params = {
                    uri: url,
                    body: JSON.stringify(body)
                };
                request.put(params, function(err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant create document'));
                    }
                    // document has been inserted into database
                    res.setHeader('Location', 'http://' + req.headers.host + req.url);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    res.send("points added");
                    res.end();
                });
            };
        });
    });
    //Register a new user just a simple check if it exists if not, adding by creating the json and pushing it to couchdb
    server.put(/^\/register\/([a-z]+)$/, function(req, res, next) {
        console.log('NEW USER!');
        console.log('PUT: ' + req.params[0])
        // checks to see if the username is in the URL 
        if(req.params[0] != req.authorization.basic.username) {
            return next(new restify.ForbiddenError('You cant access that user'));
        }
        // checks it contains  content type application/json
        if(req.headers['content-type'] != 'application/json') {
            return next(new restify.UnsupportedMediaTypeError('Bad Content-Type'));
        }
        // checks if it has basic authorization
        if(req.authorization.scheme != 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
        }
        var url = 'http://localhost:5984/users/' + req.params[0];
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            if(response.statusCode == 200) {
                return next(new restify.InternalServerError('user already created'));
            } else if(response.statusCode == 404) {
                var salt = rand(160, 36),
                    password = sha1(req.authorization.basic.password + salt),
                    d = new Date(),
                    date = d.toUTCString();
                console.log(date)
                var doc = {
                    date_joined: date,
                    last_modified: date,
                    password: password,
                    salt: salt,
                    points: 0,
                    transactions: []
                };
                var docStr = JSON.stringify(doc);
                var params = {
                    uri: url,
                    body: JSON.stringify(doc)
                };
                request.put(params, function(err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant create document'));
                    }
                    // document has been inserted into database
                    body = JSON.parse(body);
                    res.send({
                        user: req.params
                    });
                    res.end();
                });
            };
            // if the document is found, that means the user is already created.
        });
    });
    //Grab a users profile
    server.get(/^\/user/([a-z]+)$/, function(req, res, next) {
        console.log('GRABBING USER');
        console.log('GET ' + req.params[0]);
        var user = {
            test: 'test'
        };
        // checks to see if the username is in the URL 
        if(req.params[0] != req.authorization.basic.username) {
            return next(new restify.ForbiddenError('You can\'t access that user'));
        }
        // checks it contains  content type application/json
        if(req.headers['content-type'] != 'application/json') {
            return next(new restify.UnsupportedMediaTypeError('Bad Content-Type'));
        }
        // checks if it has basic authorization
        if(req.authorization.scheme != 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
        }
        console.log('parameters supplied');
        var url = 'http://localhost:5984/users/' + req.params[0];
        request.get(url, function(err, response, body) {
            console.log("request started")
            // if user is not found will send 404 error
            if(response.statusCode == 404) {
                return next(new restify.BadRequestError('User Not Found'))
            };
            if(response.statusCode == 200) {
                body = JSON.parse(body);
                //res.header('ETag', body._rev);
                res.header('Last-Modified', body.last_modified);
                res.header('Accepts', 'GET');
                user = {
                    id: body._id,
                    date_joined: body.date_joined,
                    last_modified: body.last_modified,
                    points: body.points,
                    transactions: body.transactions
                }
                console.log(user.points)
                console.log("set user");
                res.send(user);
                console.log("sent data");
                res.end();
            };
        });
    });
});