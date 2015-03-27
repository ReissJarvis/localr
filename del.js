var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    neo4j = require('node-neo4j'),
    Promise = require('promise'),
    pwdCheck = require('./passwordCheck.js');

module.exports.del = (function() {
    var db = new neo4j('http://localhost:7474');
    return {
        deleteUser: function(req, res, next) {
            var username = req.params.username,
                url = 'http://localhost:5984/users/' + username,
                password = req.authorization.basic.password,
                mainBody = {},
                credentials = true;
            if(username !== req.authorization.basic.username) {
                return next(new restify.UnauthorizedError("You do not have permission to edit this user!"))
            };
            pwdCheck.check(username, password, 'user').
            catch(function(err) {
                return next(new restify.UnauthorizedError('Invalid username/password'));
                credentials = false;
            }).then(function() {
                if(credentials === true) {
                    return new Promise(function(resolve, reject) {
                        request.get(url, function(err, response, body) {
                            if(err) {
                                reject(err)
                            };
                            console.log('code ' + response.statusCode)
                            if(body) {
                                resolve({
                                    response: response,
                                    body: body
                                })
                            }
                        })
                    }).
                    catch(function(err) {
                        console.log("GET request error on couchDB document")
                        return next(new restify.InternalServerError('Error communicating with CouchDB'));
                    }).then(function(body) {
                        if(body.response.statusCode === 200) {
                            mainBody = JSON.parse(body.body),
                            db.cypherQuery("START n = node(" + mainBody.nodeid + ") OPTIONAL MATCH (n)-->(r) delete n, r;", function(err, results) {
                                console.log('DELETING NODE: ' + mainBody.nodeid + " & RELATIONSHIPS.");
                                console.log(results)
                                if(err) {
                                    return next(new restify.InternalServerError('Cant Delete Neo4j node.'));
                                };
                            });
                        };
                    }).then(function() {
                        request.del(url + "?rev=" + mainBody._rev, function(err, response) {
                            if(err) {
                                return next(new restify.InternalServerError('Cant delete CouchDB document.'));
                            };
                            res.send(200, "Deleted User!");
                            res.end();
                        });
                    })
                }
            })
        },
        deleteBusiness: function(req, res, next) {
            var businessname = req.params.businessname,
                url = 'http://localhost:5984/business/' + businessname,
                password = req.authorization.basic.password,
                mainBody = {},
                credentials = true;
            if(businessname !== req.authorization.basic.username) {
                return next(new restify.UnauthorizedError("You do not have permission to edit this user!"))
            };
            pwdCheck.check(businessname, password, 'user').
            catch(function(err) {
                return next(new restify.UnauthorizedError('Invalid username/password'));
                credentials = false;
            }).then(function() {
                if(credentials === true) {
                    return new Promise(function(resolve, reject) {
                        request.get(url, function(err, response, body) {
                            if(err) {
                                reject(err)
                            };
                            console.log('code ' + response.statusCode)
                            if(body) {
                                resolve({
                                    response: response,
                                    body: body
                                })
                            }
                        })
                    }).
                    catch(function(err) {
                        console.log("GET request error on couchDB document")
                        return next(new restify.InternalServerError('Error communicating with CouchDB'));
                    }).then(function(body) {
                        if(body.response.statusCode === 200) {
                            mainBody = JSON.parse(body.body),
                            db.cypherQuery("START n = node(" + mainBody.nodeid + ") OPTIONAL MATCH (n)-->(r) delete n, r;", function(err, results) {
                                console.log('DELETING NODE: ' + mainBody.nodeid + " & RELATIONSHIPS.");
                                console.log(results)
                                if(err) {
                                    return next(new restify.InternalServerError('Cant Delete Neo4j node.'));
                                };
                            });
                        };
                    }).then(function() {
                        request.del(url + "?rev=" + mainBody._rev, function(err, response) {
                            if(err) {
                                return next(new restify.InternalServerError('Cant delete CouchDB document.'));
                            };
                            res.send(200, "Deleted Business!");
                            res.end();
                        });
                    })
                }
            })
        },
        getRequest: function(url) {
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) reject(err);
                    console.log('code' + response.statusCode)
                    resolve({
                        response: response,
                        body: body
                    })
                })
            });
        }
    };
})();