var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    neo4j = require('node-neo4j');

module.exports.del = (function(){
    var db = new neo4j('http://localhost:7474');
    return {
        deleteUser: function(req, res, next){
            var username = req.params.username,
                url = 'http://localhost:5984/users/' + username,
                mainBody = {};
            if(username !== req.authorization.basic.username){
                return next(new restify.UnauthorizedError("You do not have permission to edit this user!"))
            };
            getRequest(url).catch(function(err) {
                console.log("get request error")
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(body){
                if(body.response.statusCode === 200){
                    mainBody = JSON.parse(body.body),
                    db.cypherQuery("START n = node(" + mainBody.nodeid + ") OPTIONAL MATCH (n)-->(r) delete n, r;", function(err, results) {
                        console.log('DELETING NODE: ' + mainBody.nodeid + " & RELATIONSHIPS.");
                        console.log(results)
                        if(err){
                            return next(new restify.InternalServerError('Cant Delete Neo4j node.'));
                        };
                    });
                };
            }).then(function(){
                request.del(url + "?rev=" + mainBody.rev, function (err, response) {
                    if (err) {
                        return next(new restify.InternalServerError('Cant delete CouchDB document.'));
                    };
                    res.send(202, "Deleted User!");
                    res.end();
                });
            })
        },
        deleteBusiness: function(req, res, next){
            var businessname = req.params.businessname,
                url = 'http://localhost:5984/business/' + businessname,
                mainBody = {};
            if(businessname !== req.authorization.basic.username){
                return next(new restify.UnauthorizedError("You do not have permission to edit this user!"))
            };
            getRequest(url).catch(function(err) {
                console.log("get request error")
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(body){
                if(body.response.statusCode === 200){
                    mainBody = JSON.parse(body.body),
                    db.cypherQuery("START n = node(" + mainBody.nodeid + ") OPTIONAL MATCH (n)-->(r) delete n, r;", function(err, results) {
                        console.log('DELETING NODE: ' + mainBody.nodeid + " & RELATIONSHIPS.");
                        console.log(results)
                        if(err){
                            return next(new restify.InternalServerError('Cant Delete Neo4j node.'));
                        };
                    });
                };
            }).then(function(){
                request.del(url + "?rev=" + mainBody.rev, function (err, response) {
                    if (err) {
                        return next(new restify.InternalServerError('Cant delete CouchDB document.'));
                    };
                    res.send(202, "Deleted Business!");
                    res.end();
                });
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