var restify = require('restify');
var request = require('request');
var rand = require('csprng');
var sha1 = require('sha1');
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.authorizationParser());
server.listen(8080, function() {
    console.log('incoming request being handled');
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
        req.params['items'].forEach(function(item){
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
});