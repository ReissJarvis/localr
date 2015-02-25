var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1');

function del(req, res, next, type) {
    if(type == "users") {
        if((validateHTTP.validateHTTP(req, res, next, "users")) === true) {
            console.log('DELETE USER');
            console.log('DELETE ' + req.params.username);
            validateHTTP.validateHTTP(req, res, next, "users");
            console.log('parameters supplied');
            var url = 'http://localhost:5984/users/' + req.params.username;
            request.get(url, function(err, response, body) {
                console.log("request started");
                // if user is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('User Not Found'));
                };
                if(response.statusCode == 200) {
                    console.log("Everything 200");
                    var body = JSON.parse(body);
                    var rev = body._rev;
                    console.log(rev);
                    request.delete(url + "?rev=" + rev, function(err, response) {
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
            var url = 'http://localhost:5984/users/' + req.params.businessname;
            request.get(url, function(err, response, body) {
                console.log("request started");
                // if business is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('Business Not Found'));
                };
                if(response.statusCode == 200) {
                    console.log("Everything 200");
                    var rev = body._rev;
                    request.delete(url + "?rev=" + rev, function(err) {
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