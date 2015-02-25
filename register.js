var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');

function register(req, res, next, type) {
    if(type == "users") {
        if((validateHTTP.validateHTTP(req, res, next, "users")) === true) {
            console.log('NEW USER!');
            console.log('PUT: ' + req.params.username)
            db = new neo4j('http://localhost:7474');
            var nodeid = 0;
            var url = 'http://localhost:5984/users/' + req.params.username;
            validateHTTP.validateHTTP(req, res, next, "users");
            request.get(url, function(err, response, body) {
                if(err) {
                    return next(new restify.InternalServerError('Error has occured'));
                }
                // if the document isnt found it will create it from sratch
                console.log('code' + response.statusCode)
                if(response.statusCode === 200) {
                    return next(new restify.ConflictError('user already created'));
                } else if(response.statusCode === 404) {
                    db.insertNode({
                        name: req.params.username
                    }, ['User'], function(err, node) {
                        if(err) throw err;
                        // Output node properties.
                        console.log('New neo4j node created with name = ' + node.name);
                        // Output node id.
                        console.log(node._id);
                        nodeid = node._id
                        var salt = rand(160, 36),
                            password = sha1(req.authorization.basic.password + salt),
                            d = new Date(),
                            date = d.toUTCString();
                        console.log(date);
                        console.log('Just above doc node id  ' + nodeid);
                        var doc = {
                            date_joined: date,
                            last_modified: date,
                            password: password,
                            salt: salt,
                            points: 0,
                            transactions: [],
                            nodeid: nodeid
                        };
                        console.log('underneath node.id  ' + doc.nodeid);
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
                    });
                };
            });
            // if the document is found, that means the user is already created.
        };
    } else if(type == "business") {
        if((validateHTTP.validateHTTP(req, res, next, "business")) === true) {
            console.log('NEW BUSINESS!');
            console.log('PUT: ' + req.params.businessname)
            db = new neo4j('http://localhost:7474');
            var nodeid = 0;
            var url = 'http://localhost:5984/business/' + req.params.businessname;
            validateHTTP.validateHTTP(req, res, next, "business")
            request.get(url, function(err, response, body) {
                if(err) {
                    return next(new restify.InternalServerError('Error has occured'));
                }
                // if the document isnt found it will create it from sratch
                console.log('code' + response.statusCode)
                if(response.statusCode === 200) {
                    return next(new restify.ConflictError('user already created'));
                } else if(response.statusCode === 404) {
                    db.insertNode({
                        name: req.params.businessname
                    }, ['User'], function(err, node) {
                        if(err) throw err;
                        // Output node properties.
                        console.log('New neo4j node created with name = ' + node.name);
                        // Output node id.
                        console.log(node._id);
                        nodeid = node._id
                        var salt = rand(160, 36),
                            password = sha1(req.authorization.basic.password + salt),
                            d = new Date(),
                            date = d.toUTCString();
                        console.log(date);
                        console.log('Just above doc node id  ' + nodeid);
                        var doc = {
                            date_joined: date,
                            last_modified: date,
                            password: password,
                            salt: salt,
                            nodeid: nodeid
                        };
                        console.log('underneath node.id  ' + doc.nodeid);
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
                                business: req.params
                            });
                            res.end();
                        });
                    });
                };
            });
            // if the document is found, that means the user is already created.
        };
    } else {
        console.log("Error, Invalid Type!");
    };
};
module.exports.register = register;