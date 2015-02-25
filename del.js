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
                    request.del(url, function(err)) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant delete document'));
                        } else {
                            console.log("Deleted User!");
                        };
                    };
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
                    request.del(url, function(err)) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant delete document'));
                        } else {
                            console.log("Deleted Business!");
                        };
                    };
                };
            });
        };
    } else {
        console.log("Error, Invalid Type!");
    };
};
module.exports.del = del;