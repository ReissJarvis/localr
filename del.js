var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    neo4j = require('node-neo4j');

function del(req, res, next, type) {
    if(type == "users") {
        if((validateHTTP.validateHTTP(req, res, next, "users")) === true) {
            console.log('DELETE USER');
            console.log('DELETE ' + req.params.username);
            validateHTTP.validateHTTP(req, res, next, "users");
            console.log('parameters supplied');
            var url = 'http://localhost:5984/users/' + req.params.username,
                db = new neo4j('http://localhost:7474');
            request.get(url, function(err, response, body) {
                console.log("request started");
                // if user is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('User Not Found'));
                };
                if(response.statusCode == 200) {
                    console.log("Everything 200");
                    var body = JSON.parse(body),
                        rev = body._rev,
                        nodeid = body.nodeid;
                    console.log(rev);
                    console.log(nodeid);
                    db.cypherQuery("start m = node("+ nodeid +") match n<-[r]-m  return r", function(err, results) {
                        if(err) throw err;
                        console.log(results);
                        results.forEach(function(item){
                           var id = item._id;
                            console.log(id);
                        });
                    });
                    
                    // 
                    // db.deleteRelationship(relationship_id, function(err, relationship){
                    //          if(err) throw err;
                    //          if(relationship === true){
                    //                  relationship deleted
                    //          } else {
                    //                  relationship not deleted because not found.
                    //          }
                    //});
                    // 
                    // 
                    // })
                    // delete the node
                    //                     b.deleteNode(nodeid, function(err, node) {
                    //                         if(err) throw err;
                    //                         if(node === true) {
                    //                             // node deleted
                    //                         } else {
                    //                             // node not deleted because not found or because of existing relationships
                    //                         }
                    //                     });
                    request.del(url + "?rev=" + rev, function(err, response) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant delete document'));
                        };
                        console.log("Deleted User!");
                        res.send("Deleted User!");
                        res.end();
                    });
                };
            });
        };
    } else if(type == "business") {
        if((validateHTTP.validateHTTP(req, res, next, "business")) === true) {
            console.log('DELETE BUSINESS');
            console.log('DELETE ' + req.params.businessname);
            validateHTTP.validateHTTP(req, res, next, "business");
            console.log('parameters supplied');
            var url = 'http://localhost:5984/business/' + req.params.businessname;
            request.get(url, function(err, response, body) {
                console.log("request started");
                // if business is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('Business Not Found'));
                };
                if(response.statusCode == 200) {
                    console.log("Everything 200");
                    var body = JSON.parse(body),
                        rev = body._rev;
                    request.del(url + "?rev=" + rev, function(err) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant delete document'));
                        };
                        console.log("Deleted Business!");
                        res.send("Deleted Business!");
                        res.end();
                    });
                };
            });
        };
    } else {
        console.log("Error, Invalid Type!");
    };
};
module.exports.del = del;