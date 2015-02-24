var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

function register(req, res, next) {
    if((validateHTTP.validateHTTP(req, res, next)) === true) {
        console.log('NEW USER!');
        console.log('PUT: ' + req.params.username)
        var url = 'http://localhost:5984/users/' + req.params.username;
        validateHTTP.validateHTTP(req, res, next)
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            if(response.statusCode === 200) {
                return next(new restify.InternalServerError('user already created'));
            } else if(response.statusCode === 404) {
                var salt = rand(160, 36),
                    password = sha1(req.authorization.basic.password + salt),
                    d = new Date(),
                    date = d.toUTCString();
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
                    db.insertNode({
                        name: req.params.username,
                        type: 'user'
                    }, function(err, node) {
                        if(err) throw err;
                        // Output node properties.
                        console.log('New neo4j node created with name = ' + node.name);
                        // Output node id.
                        console.log(node._id);
                    });
                    res.end();
                });
            };
        });
        // if the document is found, that means the user is already created.
    }
};
module.exports.register = register;