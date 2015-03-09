var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    neo4j = require('node-neo4j');

function del(req, res, next, type) {
    if (type == "users") {
        var username = req.authorization.basic.username
        console.log('DELETE USER');
        console.log('DELETE ' + username);
        console.log('parameters supplied');
        var url = 'http://localhost:5984/users/' + username,
            db = new neo4j('http://localhost:7474');
        request.get(url, function(err, response, body) {
            console.log("request started");
            // if user is not found will send 404 error
            if (response.statusCode == 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if (response.statusCode == 200) {
                console.log("Everything 200");
                var body = JSON.parse(body),
                    rev = body._rev,
                    nodeid = body.nodeid;
                console.log(rev);
                console.log(nodeid);
                db.cypherQuery("start m = node(" + nodeid + ") match n<-[r]-m  return r", function(err, results) {
                    if (err) throw err;
                    if (results.data.length == 0) {
                        db.deleteNode(nodeid, function(err, node) {
                            if (err) throw err;
                            if (node === true) {
                                console.log("Node Deleted!");
                                request.del(url + "?rev=" + rev, function(err, response) {
                                    if (err) {
                                        return next(new restify.InternalServerError('Cant delete document'));
                                    };
                                    console.log("Deleted User!");
                                    res.send("Deleted User!");
                                    res.end();
                                });
                            } else {
                                console.log("Node not Deleted");
                                return next(new restify.InternalServerError('Cant delete node!'));
                            };
                        });
                    } else {
                        var resLength = results.data.length,
                            i = 0;
                        results.data.forEach(function(item) {
                            var id = item._id;
                            console.log(id);
                            i++;
                            console.log("Loggin id: " + id);
                            db.deleteRelationship(id, function (err, relationship) {
                                if (err) throw err;
                                if (relationship === true) {
                                    console.log("Deleted Relationship!");
                                    if (i == resLength) {
                                        db.deleteNode(nodeid, function(err, node) {
                                            if (err) throw err;
                                            if (node === true) {
                                                console.log("Node Deleted!");
                                                request.del(url + "?rev=" + rev, function (err, response) {
                                                    if(err) {
                                                        return next(new restify.InternalServerError('Cant delete document'));
                                                    };
                                                    console.log("Deleted User!");
                                                    res.send("Deleted User!");
                                                    res.end();
                                                });
                                            } else {
                                                console.log("Node not Deleted");
                                                return next(new restify.InternalServerError('Cant delete node!'));
                                            };
                                        });
                                    };
                                } else {
                                    console.log("Relationship not Deleted...");
                                    return next(new restify.InternalServerError('Cant delete Relationship!'));
                                };
                            });
                        });
                    };
                    console.log(results);
                })
            };
        });
    } else if (type == "business") {
        var businessName = req.authorization.basic.username
        console.log('DELETE BUSINESS');
        console.log('DELETE ' + businessName);
        validateHTTP.validateHTTP(req, res, next, "business");
        console.log('parameters supplied');
        var url = 'http://localhost:5984/business/' + businessName;
        request.get(url, function(err, response, body) {
            console.log("request started");
            // if business is not found will send 404 error
            if (response.statusCode == 404) {
                return next(new restify.NotFoundError('Business Not Found'));
            };
            if (response.statusCode == 200) {
                console.log("Everything 200");
                var body = JSON.parse(body),
                    rev = body._rev;
                db.cypherQuery("start m = node(" + nodeid + ") match n<-[r]-m  return r", function(err, results) {
                    if (err) throw err;
                    if (results.data.length == 0) {
                        db.deleteNode(nodeid, function (err, node) {
                            if (err) throw err;
                            if (node === true) {
                                console.log("Node Deleted!");
                                request.del(url + "?rev=" + rev, function (err, response) {
                                    if (err) {
                                        return next(new restify.InternalServerError('Cant delete document'));
                                    };
                                    console.log("Deleted Business!");
                                    res.send("Deleted Business!");
                                    res.end();
                                });
                            } else {
                                console.log("Node not Deleted");
                                return next(new restify.InternalServerError('Cant delete node!'));
                            };
                        });
                    } else {
                        var resLength = results.data.length,
                            i = 0;
                        results.data.forEach(function (item) {
                            var id = item._id;
                            console.log(id);
                            i++;
                            console.log("Loggin id: " + id);
                            db.deleteRelationship(id, function (err, relationship) {
                                if (err) throw err;
                                if (relationship === true) {
                                    console.log("Deleted Relationship!");
                                    if (i == resLength) {
                                        db.deleteNode(nodeid, function(err, node) {
                                            if (err) throw err;
                                            if (node === true) {
                                                console.log("Node Deleted!");
                                                request.del(url + "?rev=" + rev, function(err, response) {
                                                    if (err) {
                                                        return next(new restify.InternalServerError('Cant delete document'));
                                                    };
                                                    console.log("Deleted Bsuiness!");
                                                    res.send("Deleted Business!");
                                                    res.end();
                                                });
                                            } else {
                                                console.log("Node not Deleted");
                                                return next(new restify.InternalServerError('Cant delete node!'));
                                            };
                                        });
                                    };
                                } else {
                                    console.log("Relationship not Deleted...");
                                    return next(new restify.InternalServerError('Cant delete Relationship!'));
                                };
                            });
                        });
                    };
                    console.log(results);
                });
            };
        });
    } else {
        console.log("Error, Invalid Type!");
    };
};
module.exports.del = del;