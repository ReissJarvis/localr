var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid');

function getDetails(req, res, next, type) {
    if(type == "users") {
        if((validateHTTP.validateHTTP(req, res, next)) === true) {
            //Grab a users profile
            console.log('GRABBING USER');
            console.log('GET ' + req.params.username);
            var user = {
                test: 'test'
            };
            validateHTTP.validateHTTP(req, res, next)
            console.log('parameters supplied');
            var url = 'http://localhost:5984/users/' + req.params.username;
            request.get(url, function(err, response, body) {
                console.log("request started")
                // if user is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('User Not Found'))
                };
                if(response.statusCode == 200) {
                    body = JSON.parse(body);
                    //res.header('ETag', body._rev);
                    res.header('Last-Modified', body.last_modified);
                    res.header('Accepts', 'GET');
                    user = {
                        id: body._id,
                        date_joined: body.date_joined,
                        last_modified: body.last_modified,
                        points: body.points,
                        transactions: body.transactions
                    };
                    console.log(user.points)
                    console.log("set user");
                    res.send(user);
                    console.log("sent data");
                    res.end();
                };
            });
        }
    } else if(type == "business") {
        if((validateHTTP.validateHTTP(req, res, next)) === true) {
            //Grab a users profile
            console.log('GRABBING BUSINESS');
            console.log('GET ' + req.params.businessname);
            var business = {
                test: 'test'
            };
            validateHTTP.validateHTTP(req, res, next)
            console.log('Parameters Supplied');
            var url = 'http://localhost:5984/business/' + req.params.businessname;
            request.get(url, function(err, response, body) {
                console.log("request started")
                // if business is not found will send 404 error
                if(response.statusCode == 404) {
                    return next(new restify.BadRequestError('Business Not Found'))
                };
                if(response.statusCode == 200) {
                    body = JSON.parse(body);
                    //res.header('ETag', body._rev);
                    res.header('Last-Modified', body.last_modified);
                    res.header('Accepts', 'GET');
                    business = {
                        id: body._id,
                        date_joined: body.date_joined,
                        last_modified: body.last_modified,
                    };
                    console.log("set business");
                    res.send(business);
                    console.log("sent data");
                    res.end();
                };
            });
        }
    } else {
        console.log("Error, Invalid Type!");
    }
};
module.exports.getDetails = getDetails;