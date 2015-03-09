var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid');
module.exports.getDetails = function (req, res, next, type) {
    if(type == "users") {
        if(!req.params.username) {
            return next(new restify.BadRequestError("You didn't select a user - please add on the username like /users/xxx"))
        }
        //Grab a users profile
        console.log('GRABBING USER');
        console.log('GET ' + req.params.username);
        var user = {};
        console.log('parameters supplied');
        var url = 'http://localhost:5984/users/' + req.params.username;
        request.get(url, function (err, response, body) {
            console.log("request started")
            // if user is not found will send 404 error
            if (response.statusCode == 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if (response.statusCode == 200) {
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
    } else if (type == "business") {
        if (!req.params.businessname) {
            return next(new restify.BadRequestError("You didn't select a user - please add on the username like /users/xxx"))
        }
        //Grab a users profile
        console.log('GRABBING BUSINESS');
        console.log('GET ' + req.params.businessname);
        var business = {};
        console.log('Parameters Supplied');
        var url = 'http://localhost:5984/business/' + req.params.businessname;
        request.get(url, function(err, response, body) {
            console.log("request started")
            // if business is not found will send 404 error
            if (response.statusCode == 404) {
                return next(new restify.NotFoundError('Business Not Found'));
            };
            if (response.statusCode == 200) {
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
    } else {
        console.log("Error, Invalid Type!");
    }
};