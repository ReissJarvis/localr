var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    getuser = require("./getuser.js"),
    checkin = require("./checkin.js"),
    register = require("./register.js");

function register(req, res, next) {
    console.log('NEW USER!');
    console.log('PUT: ' + req.params[0])
    var url = 'http://localhost:5984/users/' + req.params[0];
    validateHTTP.validateHTTP(req, res, next)
    request.get(url, function(err, response, body) {
        if(err) {
            return next(new restify.InternalServerError('Error has occured'));
        }
        // if the document isnt found it will create it from sratch
        console.log('code' + response.statusCode)
        if(response.statusCode == 200) {
            return next(new restify.InternalServerError('user already created'));
        } else if(response.statusCode == 404) {
            var salt = rand(160, 36),
                password = sha1(req.authorization.basic.password + salt),
                d = new Date(),
                date = d.toUTCString();
            console.log(date)
            var doc = {
                date_joined: date,
                last_modified: date,
                password: password,
                salt: salt,
                points: 0,
                transactions: []
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
                res.send({
                    user: req.params
                });
                res.end();
            });
        };
    });
    // if the document is found, that means the user is already created.
};

exports.register = register;

