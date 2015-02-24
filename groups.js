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
        var url = 'http://l.adam-holt.co.uk:5984/group/' + req.params.groupname;
        var competition = req.params.competition
        var groupname = req.params.groupname
        var description = req.params.description
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
                        console.log("name" + result.data[0].name); // delivers an array of query results
                        console.log("description" + result.data[0].description); // delivers an array of query results
                        console.log("id" + result.data[0]._id); // delivers an array of query results
                        console.log(result.columns); // delivers an array of names of objects getting returned
                        console.log("group name = " + groupname)
                        console.log("description = " + description)
                        console.log("competitionid = " + competitionid)
                        db.insertNode({
                            name: groupname,
                            description: description
                        },['Group', competition], function(err, node) {
                            if(err) throw err;
                            // Output node properties.
                            console.log('New neo4j node created with Groupname  = ' + node.name);
                            // Output node id.
                            console.log(node._id);
                            console.log('starting insert relationship')
                            db.insertRelationship(node._id, competitionid, 'COMPETING_IN', {description:'competiting in this competition'}, function(err, relationship) {
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
                                    groupnodeid: node._id,
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
                    }
                    console.log(result.data.length); // delivers an array of query results
                });
                //                 
            };
        });
        // if the document is found, that means the user is already created.
    }
};