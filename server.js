//Adam testing git is working on the VPS
//Were also not using Python hahaha no #####
var restify = require('restify');
var request = require('request');
var rand = require('csprng');
var sha1 = require('sha1');
var server = restify.createServer();
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
server.listen(8080, function() {
    console.log('incoming request being handled');
    // lists put requests use as reference
    server.put(/^\/lists\/([a-z]+)$/, function(req, res, next) {
        console.log('PUT ' + req.params[0]);
        console.log('PUT ' + req.headers);
        // checks to see if the username is in the URL 
        if(req.params[0] != req.authorization.basic.username) {
            return next(new restify.ForbiddenError('mismatched username and url'));
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
        var url = 'http://localhost:5984/lists/' + req.params[0];
        // if put has items in the json it will grab whats in it, in this case items must be
        // an array which could ( ["item","item", "item"])
        console.log("items: " + req.params['items'])
        req.params['items'].forEach(function(item) {
            console.log(item)
        });
        var items = req.params['items'];
        request.get(url, function(err, response, body) {
            console.log("request started")
            // if the document isnt found it will create it from sratch
            if(response.statusCode == 404) {
                console.log('document not found');
                var salt = rand(160, 36);
                console.log(req.authorization.basic.password + salt);
                var password = sha1(req.authorization.basic.password + salt);
                console.log(password);
                var d = new Date();
                var date = d.toUTCString();
                console.log(date);
                var doc = {
                    last_modified: date,
                    password: password,
                    salt: salt,
                    items: items
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
                    res.setHeader('Location', 'http://' + req.headers.host + req.url);
                    res.setHeader('ETag', body.rev);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    res.send({
                        items: req.params['items']
                    });
                    res.end();
                });
            };
            if(response.statusCode == 200) {
                console.log('existing document');
                body = JSON.parse(body);
                var pwd = sha1(req.authorization.basic.password + body.salt);
                if(pwd != body.password) {
                    return next(new restify.ForbiddenError('invalid username/password'));
                }
                console.log('passwords match!');
                var d = new Date();
                var date = d.toUTCString()
                body.last_modified = date;
                body.items = items;
                console.log(body);
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
                    res.setHeader('ETag', body.rev);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    res.send({
                        items: req.params['items']
                    });
                    res.end();
                });
            };
        });
        res.end()
    });
    //use this as adding points
    //The way this works is by having there name in at the moment e.g DOMAIN/checkin?user=USERNAME This will then add 10 points at the moment
    //we can change the amount places wanna do check in points at eventually. 
    server.put("/checkin", function(req, res, next) {
        var user = req.query.user
        // this will stop the rest of the request from carrying on, user contains the username of the person
        //return next(new restify.ForbiddenError(user));
        console.log('CHECKIN ');
        console.log('PUT ' + user);
        // checks to see if the username is the same as the one in the URL 
        if(user != req.authorization.basic.username) {
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
        console.log('parameters supplied');
        var url = 'http://localhost:5984/users/' + user
        // we have the url for the couchDB so now to get the users profile
        request.get(url, function(err, response, body) {
            console.log("request started")
            // if the document isnt found it will create it from sratch
            if(response.statusCode == 404) {
                return next(new restify.ForbiddenError('User Not Found'));
            };
            if(response.statusCode == 200) {
                console.log('existing document');
                body = JSON.parse(body);
                var pwd = sha1(req.authorization.basic.password + body.salt);
                if(pwd != body.password) {
                    return next(new restify.ForbiddenError('invalid username/password'));
                }
                console.log('passwords match!');
                var d = new Date();
                var date = d.toUTCString()
                // change what we need in the body e.g the points can probably add to the array aswell
                body.last_modified = date;
                body.points = body.points + 10;
                // adding the transactions to the array so we can keep track of them
                body.transactions.push('{transactionid:' + body.transactions.length + ', date:' + date + ', amount_of_points:10}')
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
                    res.setHeader('ETag', body.rev);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    res.send();
                    res.end();
                });
            };
        });
        res.end()
    });
    //Register a new user just a simple check if it exists if not, adding by creating the json and pushing it to couchdb
    server.put(/^\/register\/([a-z]+)$/, function(req, res, next) {
        var user = req.query.user
        console.log('NEW USER');
        console.log('PUT ' + req.params[0])
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
        console.log('parameters supplied');
        var url = 'http://localhost:5984/users/' + req.params[0];
        request.get(url, function(err, response, body) {
            console.log("request started")
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            if(response.statusCode == 200) {
                console.log("inside 200")
                return next(new restify.InternalServerError('Cant create document'))
            };
            if(response.statusCode == 404) {
                console.log('inside 404')
                console.log('document not found');
                var salt = rand(160, 36);
                var password = sha1(req.authorization.basic.password + salt);
                var d = new Date();
                var date = d.toUTCString();
                console.log(date);
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
        res.send("{'user added'}")
        res.end()
    });
    //Grab a users profile
    server.get(/^\/users\/([a-z]+)$/, function(req, res, next) {
        console.log('GRABBING USER');
        console.log('GET ' + req.params[0])
        var user = {
            test: 'test'
        };
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
                res.header('ETag', body._rev);
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