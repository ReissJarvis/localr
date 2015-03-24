var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    Promise = require('promise');

module.exports.update = function(req, res, next, type) {
    if(type == "users") {
        var username = req.authorization.basic.username,
            url = 'http://localhost:5984/users/' + username,
            salt = rand(160, 36);
        console.log("Updating: " + username);
        request.get(url, function(err, response, body) {
            if(response.statusCode === 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if(response.statusCode === 200) {
                body = JSON.parse(body);
                url = "http://localhost:5984/users/" + body._rev;
                if(typeof req.params.firstname !== "undefined" && req.params.firstname) {
                    body.firstname = req.params.firstname;
                };
                if(typeof req.params.surname !== "undefined" && req.params.surname) {
                    body.surname = req.params.surname;
                };
                if(typeof req.params.city !== "undefined" && req.params.city) {
                    body.city = req.params.city;
                };
                if(typeof req.params.dob !== "undefined" && req.params.dob) {
                    body.dob = req.params.dob;
                };
                if(typeof req.params.password !== "undefined" && req.params.password) {
                    body.password = sha1(req.params.password + salt);
                };
                var params = {
                    uri: url,
                    body: JSON.stringify(body)
                };
                request.put(params, function(err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant Update CouchDB document'));
                    }
                    res.setHeader('Last-Modified', body.last_modified);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    var sendBack = {
                            update: 'OK',
                            username: username,
                            firstname: body.firstname,
                            surname: body.surname,
                            city: body.city,
                            dob: body.dob
                        };
                    res.send(200, sendBack);
                    res.end();
                });
            };
        });
    } else if(type == "business") {
        var businessname = req.authorization.basic.username,
            url = 'http://localhost:5984/business/' + businessname,
            salt = rand(160, 36);
        console.log("Updating: " + businessname);
        request.get(url, function(err, response, body) {
            if(response.statusCode === 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if(response.statusCode === 200) {
                body = JSON.parse(body);
                url = "http://localhost:5984/business/" + body._rev;
                if(typeof req.params.password !== "undefined" && req.params.password) {
                    body.password = sha1(req.params.password + salt);
                };
                if(typeof req.params.address !== "undefined" && req.params.address) {
                    body.address = req.params.address;
                };
                if(typeof req.params.city !== "undefined" && req.params.city) {
                    body.city = req.params.city;
                };
                if(typeof req.params.postcode !== "undefined" && req.params.postcode) {
                    body.postcode = req.params.postcode;
                };
                if(typeof req.params.longitude !== "undefined" && req.params.longitude) {
                    body.longitude = req.params.longitude;
                };
                if(typeof req.params.latitude !== "undefined" && req.params.latitude) {
                    body.latitude = req.params.latitude;
                };
                var params = {
                    uri: url,
                    body: JSON.stringify(body)
                };
                request.put(params, function(err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant Update CouchDB document'));
                    }
                    res.setHeader('Last-Modified', body.last_modified);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    var sendBack = {
                            Update: 'OK',
                            businessname: businessname,
                            address: body.address,
                            city: body.surname,
                            postcode: body.postcode,
                            longitude: body.longitude,
                            latitude: body.latitude
                        };
                    res.send(200, sendBack);
                    res.end();
                });
            };
        });
    } else {
        console.log("Error, Invalid Type!");
    };
};