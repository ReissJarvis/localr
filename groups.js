var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j'),
    Promise = require('promise');
module.exports.creategroup = function(req, res, next) {
    console.log(req.params);
    console.log("POST " + req.params.groupname)
    var url = 'http://localhost:5984/groups/' + req.params.groupname
    var competition = req.params.competition;
    var groupname = req.params.groupname;
    var description = req.params.description;
    console.log(competition + " Group :" + groupname + " Description: " + description)
    var groupid = 0;
    var userid = 0;
    getRequest(url).
    catch(function(err) {
        return next(new restify.InternalServerError('Error has occured'));
    }).then(function(call) {
        if(response.statusCode === 200) {
            return next(new restify.ConflictError('Group Already Created'));
        }
    }).then(db.cypherQuery(" MATCH (n:competition) WHERE n.name ='" + competition + "' RETURN n", function(err, result) {
        if(err) throw err;
        if(result.data.length == 0) {
            return next(new restify.InternalServerError('no competition found'));
        }
        return competitionid = result.data[0]._id
    })).then(function(id) {
        db.cypherQuery("MATCH (n:group) WHERE n.name ='" + groupname + "' RETURN n", function(err, results) {
            if(err) throw err;
            if(results.data.length == 0) {
                return results.data
            } else {
                console.log(result.data[0])
                return next(new restify.ConflictError('Group already created'));
            }
        })
    }).then(function(data) {
        db.insertNode({
            name: groupname,
            description: description
        }, ['Group', competition], function(err, node) {
            if(err) throw err;
            // Output node properties.
            console.log('New neo4j node created with Groupname  = ' + node.name);
            groupid = node._id
            console.log('group id = ' + groupid)
            return node._id
        });
    }).then(function(nodeid) {
        db.insertRelationship(node._id, competitionid, 'COMPETING_IN', {
            description: 'competiting in this competition'
        }, function(err, relationship) {
            if(err) throw err;
            console.log('relationship made')
            // Output relationship id.
            console.log(relationship._id);
            // Output relationship start_node_id.
            console.log(relationship._start);
            // Output relationship end_node_id.
            console.log(relationship._end);
        })
    }).then(function() {
        db.cypherQuery(" MATCH (n:User) WHERE n.name ='" + req.authorization.basic.username + "' RETURN n", function(err, Results) {
            if(err) throw err;
            console.log('name = ' + Results.data[0])
            console.log('user = ' + Results.data[0]._id)
            userid = Results.data[0]._id
            console.log('userid =' + userid)
            console.log(groupid)
            return userid
        })
    }).then(function(id) {
        db.insertRelationship(userid, groupid, 'IN_GROUP', {
            description: 'Created this group'
        }, function(err, relationship) {
            if(err) throw err;
            return relationship._id
        })
    }).then(function(id) {
        var d = new Date(),
            date = d.toUTCString();
        console.log(date);
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
        var docStr = JSON.stringify(doc);
        var params = {
            uri: url,
            body: JSON.stringify(doc)
        };
        return params
    }).then(function(params) {
        request.put(params, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Cant create document'));
            }
            // document has been inserted into database
            body = JSON.parse(body);
            console.log('about to sent res')
            res.send(201, {
                Group: req.params
            });
            res.end();
        });
    })
};
getRequest = function(url) {
    // set up initial get request. 
    console.log("start of promise")
    return new Promise(function(resolve, reject) {
        request.get(url, function(err, response, body) {
            if(err) reject(err);
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            resolve({
                response: response,
                body: body
            })
        })
    });
}
module.exports.showgroup = function(req, res, next) {
    db = new neo4j('http://localhost:7474');
    console.log('GET');
    console.log('GET: ' + req.params.groupname);
    var url = 'http://localhost:5984/groups/' + req.params.groupname;
    validateHTTP.validateHTTP(req, res, next, "users")
    var topres = res
    request.get(url, function(err, response, body) {
        if(err) {
            return next(new restify.InternalServerError('Failed To Connect To Database'));
        }
        // if the document isnt found it will create it from sratch
        console.log('code' + response.statusCode)
        if(response.statusCode === 200) {
            body = JSON.parse(body);
            //res.header('ETag', body._rev);
            res.header('Last-Modified', body.last_modified);
            res.header('Accepts', 'GET');
            group = {
                id: body._id,
                groupname: body.groupname,
                description: body.description,
                last_modified: body.last_modified,
                points: body.grouppoints,
                transactions: body.transactions,
                owner: body.createdby,
                groupmemebers: body.usersjoined
            }
            console.log(group)
            console.log("Set Group data");
            res.send(group);
            console.log("sent group data");
            res.end();
        } else if(response.statusCode === 404) {
            return next(new restify.ConflictError('Group Already Created'));
        }
    });
};
module.exports.showcompetitiongroup = function(req, res, next) {
    //match (n:freshers)-[COMPETING_IN]->r return n,r
    db = new neo4j('http://localhost:7474');
    console.log('GET');
    console.log('GET COMPETITION GROUPS: ' + req.params.competition)
    var url = 'http://localhost:5984/groups/' + req.params.groupname;
    var competition = req.params.competition
    validateHTTP.validateHTTP(req, res, next)
    var topres = res
    db.cypherQuery("match (n:" + competition + ")-[COMPETING_IN]->r return labels(n),n,r", function(err, Results) {
        if(err) throw err;
        if(Results.data == 0) {
            return next(new restify.NotFoundError('Competition not found'));
        } else {
            res.send(Results.data);
            console.log("competition data sent");
            res.end();
        }
    });
};
module.exports.joinGroup = function(req, res, next) {
    var db = new neo4j('http://localhost:7474');
    console.log('PUT');
    console.log('JOIN GROUP: ' + req.params.username + ' ' + req.params.groupname)
    var url = 'http://localhost:5984/users/' + req.authorization.basic.username;
    var groupurl = 'http://localhost:5984/groups/' + req.params.groupname;
    var userid = 0,
        groupid = 0,
        groupname = req.params.groupname,
        username = req.authorization.basic.username;
    validateHTTP.validateHTTP(req, res, next, "users");
    var topres = res
    //check user exists
    request.get(url, function(err, response, body) {
        // if user is not found will send 404 error
        if(response.statusCode === 404) {
            return next(new restify.BadRequestError('User Not Found'))
        };
        if(response.statusCode === 200) {
            body = JSON.parse(body);
            userid = body.nodeid;
            //check group exists
            db.cypherQuery("match n where n.name='" + groupname + "' return n", function(err, Results) {
                if(err) throw err;
                if(Results.data == 0) {
                    return next(new restify.NotFoundError('Group not found'));
                } else {
                    groupid = Results.data[0]._id
                    console.log("Group ID set");
                    var d = new Date(),
                        date = d.toUTCString();
                    console.log(date);
                    //make relationship
                    db.insertRelationship(userid, groupid, 'IN_GROUP', {
                        datejoined: date,
                    }, function(err, relationship) {
                        if(err) throw err;
                        res.send("relationship created @ " + date);
                        console.log("sent data");
                        res.end();
                    });
                }
            });
        };
    });
};
// rebuilding with promises and closures
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
            console.log("POST " + req.params.groupname)
            url = 'http://localhost:5984/groups/' + req.params.groupname
            var competition = req.params.competition;
            var groupname = req.params.groupname;
            var description = req.params.description;
            console.log(competition + " Group :" + groupname + " Description: " + description)
            var groupid = 0;
            var userid = 0;
            getRequest(url).
            catch(function(err) {
                console.log("get request error")
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(call) {
                if(call.statusCode === 200) {
                    return next(new restify.ConflictError('Group Already Created'));
                }
                return new Promise(function(resolve, reject) {
                    db.cypherQuery(" MATCH (n:competition) WHERE n.name ='" + competition + "' RETURN n", function(err, result) {
                        if(err) throw err;
                        console.log('CHECKING COMPETITION')
                        if(result.data.length == 0) {
                            return next(new restify.InternalServerError('no competition found'));
                        }
                        competitionid = result.data[0]._id
                        resolve(competitionid)
                    })
                }).then(function(id) {
                    return new Promise(function(resolve, reject) {
                        db.cypherQuery("MATCH (n:group) WHERE n.name ='" + groupname + "' RETURN n", function(err, results) {
                            console.log('CHECKING GROUP')
                            console.log(results)
                            if(err) throw err;
                            if(results.data.length == 0) {
                                resolve(results.data)
                            } else {
                                console.log(results.data[0])
                                reject(next(new restify.ConflictError('Group already created')));
                            }
                        })
                    }).then(function(data) {
                        return new Promise(function(resolve, reject) {
                            db.insertNode({
                                name: groupname,
                                description: description
                            }, ['Group', competition], function(err, node) {
                                if(err) throw err;
                                // Output node properties.
                                console.log('New neo4j node created with Groupname  = ' + node.name);
                                groupid = node._id
                                console.log('group id = ' + groupid)
                                resolve(node._id)
                            });
                        }).then(function(nodeid) {
                            return new Promise(function(resolve, reject) {
                                console.log("CHECKING RELATIONSHIP")
                                db.insertRelationship(nodeid, competitionid, 'COMPETING_IN', {
                                    description: 'competiting in this competition'
                                }, function(err, relationship) {
                                    if(err) throw err;
                                    console.log("RELATIONSHIP= " + relationship)
                                    resolve(relationship._id)
                                })
                            }).then(function(id) {
                                return new Promise(function(resolve, reject) {
                                    db.cypherQuery(" MATCH (n:User) WHERE n.name ='" + req.authorization.basic.username + "' RETURN n", function(err, Results) {
                                        if(err) throw err;
                                        userid = Results.data[0]._id
                                        resolve(Results.data[0]._id)
                                    })
                                }).then(function(id) {
                                    return new Promise(function(resolve, reject) {
                                        db.insertRelationship(id, groupid, 'IN_GROUP', {
                                            description: 'Created this group'
                                        }, function(err, relationship) {
                                            if(err) throw err;
                                            console.log('CHECKING USER RELATIONSHIP')
                                            console.log(relationship)
                                            resolve(relationship._id)
                                        })
                                    }).then(function(id) {
                                        return new Promise(function(resolve, reject) {
                                            var d = new Date(),
                                                date = d.toUTCString();
                                            console.log(date);
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
                                                body: JSON.stringify(doc)
                                            };
                                            resolve(params)
                                        }).then(function(params) {
                                            request.put(params, function(err, response, body) {
                                                if(err) {
                                                    return next(new restify.InternalServerError('Cant create document'));
                                                }
                                                // document has been inserted into database
                                                body = JSON.parse(body);
                                                console.log('about to sent res')
                                                res.send(201, {
                                                    Group: params
                                                });
                                                res.end();
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        },
        getRequest: function(url) {
            // set up initial get request. 
            console.log("get promise started")
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    console.log('code ' + response.statusCode)
                    if(body) {
                        resolve(response)
                    }
                })
            });
        },
        putRequest: function(params) {
            return new Promise(function(resolve, reject) {
                request.put(params, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    console.log('code' + response.statusCode)
                    resolve({
                        response: response,
                        body: body
                    })
                })
            });
        },
        deletegroup: function(req, res, next) {}
    }
})();
module.exports.delgroup = function(req, res, next) {
    // check group exists
    // check owner is correct
    // delete relationships
    // delete couchdb
    // 
    // send back success.
}