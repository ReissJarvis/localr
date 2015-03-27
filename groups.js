var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j'),
    Promise = require('promise');
module.exports.groups = (function() {
    var url = "",
        competition = "",
        groupname = "",
        description = "",
        groupid = 0,
        userid = 0,
        competitionid = "",
        db = new neo4j('http://localhost:7474');
    return {
        createGroup: function(req, res, next) {
            console.log("POST " + req.params.groupname);
            url = 'http://localhost:5984/groups/' + req.params.groupname;
            competition = req.params.competition;
            groupname = req.params.groupname;
            description = req.params.description;
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    if(body) {
                        resolve(response);
                    }
                });
            }).
            catch(function(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(call) {
                if(call.statusCode === 200) {
                    return next(new restify.ConflictError('Group Already Created'));
                }
                return new Promise(function(resolve, reject) {
                    db.cypherQuery(" MATCH (n:competition) WHERE n.name ='" + competition + "' RETURN n", function(err, result) {
                        if(err) throw err;
                        if(result.data.length === 0) {
                            return next(new restify.BadRequestError('Competition Not Found'));
                        }
                        competitionid = result.data[0]._id;
                        resolve(competitionid);
                    });
                }).then(function(id) {
                    return new Promise(function(resolve, reject) {
                        db.cypherQuery("MATCH (n:group) WHERE n.name ='" + groupname + "' RETURN n", function(err, results) {

                            if(err) throw err;
                            if(results.data.length === 0) {
                                resolve(results.data);
                            } else {
                                reject(next(new restify.ConflictError('Group already created')));
                            }
                        });
                    }).then(function(data) {
                        return new Promise(function(resolve, reject) {
                            db.insertNode({
                                name: groupname,
                                description: description
                            }, ['Group', competition], function(err, node) {
                                if(err) throw err;
                                // Output node properties.
                                groupid = node._id;
                                resolve(node._id);
                            });
                        }).then(function(nodeid) {
                            return new Promise(function(resolve, reject) {
                                db.insertRelationship(nodeid, competitionid, 'COMPETING_IN', {
                                    description: 'competiting in this competition'
                                }, function(err, relationship) {
                                    if(err) throw err;
                                    resolve(relationship._id);
                                });
                            }).then(function(id) {
                                return new Promise(function(resolve, reject) {
                                    db.cypherQuery(" MATCH (n:User) WHERE n.name ='" + req.authorization.basic.username + "' RETURN n", function(err, Results) {
                                        if(err) throw err;
                                        userid = Results.data[0]._id;
                                        resolve(Results.data[0]._id);
                                    });
                                }).then(function(id) {
                                    return new Promise(function(resolve, reject) {
                                        db.insertRelationship(id, groupid, 'IN_GROUP', {
                                            description: 'Created this group'
                                        }, function(err, relationship) {
                                            if(err) throw err;
                                            console.log(relationship);
                                            resolve(relationship._id);
                                        });
                                    }).then(function(id) {
                                        return new Promise(function(resolve, reject) {
                                            var d = new Date(),
                                                date = d.toUTCString();
                                            var doc = {
                                                groupname: groupname,
                                                description: description,
                                                date_joined: date,
                                                last_modified: date,
                                                createdby: req.authorization.basic.username,
                                                grouppoints: 0,
                                                transactions: [],
                                                usersjoined: [req.authorization.basic.username],
                                                competition: competition,
                                                groupnodeid: groupid
                                            };
                                            var params = {
                                                uri: url,
                                                body: JSON.stringify(doc
                                            };
                                            resolve(params);
                                        }).then(function(params) {
                                            request.put(params, function(err, response, body) {
                                                if(err) {
                                                    return next(new restify.InternalServerError('Cant create document'));
                                                }
                                                console.log("About to send res")
                                                // document has been inserted into database
                                                res.send(201,  params);
                                                res.end();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },
        getRequest: function(url) {
            // set up initial get request. 
        },
        putRequest: function(params) {
            return new Promise(function(resolve, reject) {
                request.put(params, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    resolve({
                        response: response,
                        body: body
                    });
                });
            });
        },
        deleteGroup: function(req, res, next) {
            console.log("DELETE " + req.params.groupname);
            return new Promise(function(resolve, reject) {
                db.cypherQuery("MATCH (n { name: '" + req.params.groupname + "' })-[r]-() DELETE n, r", function(err, result) {
                    if(err) throw err;
                    resolve();
                });
            }).then(function() {
                return new Promise(function(resolve, reject) {
                    console.log("getting groups");
                    url = 'http://localhost:5984/groups/' + req.params.groupname;
                    request.get(url, function(err, response, body) {
                        if(err) reject(err);
                        // if the document isnt found it will create it from sratch
                        console.log('code' + response.statusCode);
                        body = JSON.parse(body);
                        var rev = body._rev;
                            console.log(body);
                            resolve(rev);
                    });
                }).then(function(rev) {
                    url = 'http://localhost:5984/groups/' + req.params.groupname;
                    request.del(url + "?rev=" + rev, function(err, response, body) {
                        if(err) reject(err);
                        // if the document isnt found it will create it from sratch
                        console.log('code' + response.statusCode);
                        res.send(200, "group deleted");
                        res.end();
                    });
                });
            });
        },
        joinGroup: function(req, res, next) {
            return new Promise(function(resolve, reject) {
                var db = new neo4j('http://localhost:7474');
                console.log('PUT');
                console.log('JOIN GROUP: ' + req.authorization.basic.username + ' ' + req.params.groupname);
                var url = 'http://localhost:5984/users/' + req.authorization.basic.username;
                var groupurl = 'http://localhost:5984/groups/' + req.params.groupname;
                groupname = req.params.groupname;
                  var username = req.authorization.basic.username;
                //check user exists
                request.get(url, function(err, response, body) {
                    // if user is not found will send 404 error
                    if(response.statusCode === 404) {
                        return next(new restify.BadRequestError('User Not Found'));
                    }
                    if(response.statusCode === 200) {
                        body = JSON.parse(body);
                        userid = body.nodeid;
                        resolve();
                    }
                    
                });
            }).then(function() {
                return new Promise(function(resolve, reject) {
                    db.cypherQuery("match n where n.name='" + groupname + "' return n", function(err, Results) {
                        if(err) throw err;
                        if(Results.data === 0) {
                            return next(new restify.NotFoundError('Group not found'));
                        } else {
                            groupid = Results.data[0]._id;
                            var d = new Date(),
                                date = d.toUTCString();
                            //make relationship
                            resolve();
                        }
                    });
                }).then(function() {
                    return new Promise(function(resolve, reject) {
                        url = 'http://localhost:5984/groups/' + groupname;
                        request.get(url, function(err, response, body) {
                            // if user is not found will send 404 error
                            if(response.statusCode === 404) {
                                return next(new restify.BadRequestError('group Not Found'));
                            }
                            if(response.statusCode === 200) {
                                body = JSON.parse(body);
                                body.usersjoined.push(req.authorization.basic.username);
                            }
                            var params = {
                                uri:'http://localhost:5984/groups/' + req.params.groupname,
                                body: JSON.stringify(body)
                            };
                            resolve(params);
                        });
                    }).then(function(params) {
                        return new Promise(function(resolve, reject) {
                            request.put(params, function(err, response, body) {
                                if(response.statusCode === 404) {
                                    return next(new restify.BadRequestError('Group could not be updated, it doesnt exist'));
                                }
                                resolve();
                            });
                        }).then(function() {
                            var d = new Date(),
                                date = d.toUTCString();
                            db.insertRelationship(userid, groupid, 'IN_GROUP', {
                                datejoined: date,
                            }, function(err, relationship) {
                                if(err) throw err;
                                res.send(201, "relationship created @ " + date);
                                res.end();
                            });
                        });
                    });
                });
            });
        },
        showGroup: function(req, res, next) {
            //Set business name
            groupname = req.params.groupname;
            console.log('GET GROUP ' + groupname);
            url = 'http://localhost:5984/groups/' + groupname;
            //Create a promise for the get request
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) {
                        reject(err);
                    }
                    body = JSON.parse(body)
                    // if the document isnt found it will create it from sratch
                    if(body) {
                        resolve({
                            response: response,
                            body: body
                        });
                    }
                });
            }).
            catch(function(err) {
                return next(new restify.InternalServerError('Error communicating with CouchDB'));
            }).then(function(doc) {
                var d = new Date(),
                    date = d.toUTCString();
                res.setHeader('Last-Modified', date);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Accepts', 'GET');
                res.send(200, doc.body);
                res.end();
            });
        },
        showAllGroups: function(req, res, next) {
            console.log('GET GROUPS FOR COMPETITION ' + req.params.competition);
            if(!req.params.competition) {
                new restify.BadRequestError('Missing Competition: Please Use: "groups?competition=Put competition name here"');
            }
            var competition = req.params.competition;
            var url = 'http://localhost:5984/groups/_design/groups/_view/competition?startkey="' + competition + '"&endkey="' + competition + '"';
            //Create a promise for the get request
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) {
                        reject(err);
                    }
                    // if the document isnt found it will create it from sratch
                    if(body) {
                        resolve({
                            response: response,
                            body: body
                        });
                    }
                });
            }).
            catch(function(err) {
                return next(new restify.InternalServerError('Error communicating with CouchDB'));
            }).then(function(doc) {
                if(doc.response.statusCode === 404) {
                    return next(new restify.InternalServerError('No Offers Found'));
                } else if(doc.response.statusCode === 200) {
                    var resp = JSON.parse(doc.body);
                    console.log(resp.rows);
                    var competitionGroups = [];
                    resp.rows.forEach(function(i) {
                        var group = {
                            groupname: i.value.groupname,
                            description: i.value.description,
                            date_joined: i.value.date_joined,
                            last_modified: i.value.last_modified,
                            createdby: i.value.createdby,
                            grouppoints: i.value.grouppoints,
                            transactions: i.value.transactions,
                            usersjoined: i.value.usersjoined
                        };
                        competitionGroups.push(group);
                    });
                    var groups = {
                        total_groups: resp.rows.length,
                        groups: competitionGroups
                    };
                    //Time and date for header
                    var d = new Date();
                    var date = d.toUTCString();
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'GET');
                    res.send(200, groups);
                    res.end();
                }
            });
        }
    };
})();