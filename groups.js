var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');
module.exports.creategroup = function(req, res, next) {
    if((validateHTTP.validateHTTP(req, res, next)) === true) {
        db = new neo4j('http://l.adam-holt.co.uk:7474');
        console.log('NEW GROUP!');
        console.log('PUT: ' + req.params.groupname)
        console.log('FOR COMPETITION: ' + req.params.competition)
        var url = 'http://l.adam-holt.co.uk:5984/groups/' + req.params.groupname;
        var competition = req.params.competition
        var groupname = req.params.groupname
        var description = req.params.description
        var groupid = 0;
        var userid = 0;
        validateHTTP.validateHTTP(req, res, next)
        var topres = res
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            if(response.statusCode === 200) {
                return next(new restify.ConflictError('Group Already Created'));
            } else if(response.statusCode === 404) {
                db.cypherQuery(" MATCH (n:competition) WHERE n.name ='" + competition + "' RETURN n", function(err, result) {
                    if(err) throw err;
                    if(result.data.length == 0) {
                        return next(new restify.InternalServerError('no competition found'));
                    } else {
                        var competitionid = result.data[0]._id
                        console.log('Groupname = ' + groupname)
                        db.cypherQuery("MATCH (n:group) WHERE n.name ='" + groupname + "' RETURN n", function(err, results) {
                            if(err) throw err;
                            console.log('Group data = '+results.data)
                            if(results.data.length == 0) {
                                db.insertNode({
                                    name: groupname,
                                    description: description
                                }, ['Group', competition], function(err, node) {
                                    if(err) throw err;
                                    // Output node properties.
                                    console.log('New neo4j node created with Groupname  = ' + node.name);
                                    groupid = node._id
                                    console.log('group id = '+ groupid)
                                    console.log('starting insert relationship')
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
                                        db.cypherQuery(" MATCH (n:User) WHERE n.name ='" + req.authorization.basic.username + "' RETURN n", function(err, Results) {
                                            if(err) throw err;
                                            console.log('name = '+ Results.data[0])
                                            console.log('user = ' + Results.data[0]._id)
                                            userid = Results.data[0]._id
                                            console.log('userid ='+userid)
                                            console.log(groupid)
                                            db.insertRelationship(userid, groupid, 'IN_GROUP', {
                                                description: 'In this Group'
                                            }, function(err, relationship) {
                                                if(err) throw err;
                                                console.log('relationship made')
                                                // Output relationship id.
                                                console.log(relationship._id);
                                                // Output relationship start_node_id.
                                                console.log(relationship._start);
                                                // Output relationship end_node_id.
                                                console.log(relationship._end);
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
                                                    groupnodeid: groupid,
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
                                                    console.log('about to sent res')
                                                    topres.send({
                                                        Group: req.params
                                                    });
                                                    topres.end();
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                console.log(result.data[0])
                                return next(new restify.ConflictError('Group already created'));
                            }
                        })
                    }
                    console.log(result.data.length); // delivers an array of query results
                });
                //                 
            };
        });
        // if the document is found, that means the user is already created.
    }
};