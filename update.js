var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    Promise = require('promise');

module.exports.update = (function(){
    return {
        updateUser: function(req, res, next){
            var username = req.params.username,
                url = 'http://localhost:5984/users/' + username,
                salt = rand(160, 36),
                mainBody = {};
            if(username !== req.authorization.basic.username){
                return next(new restify.UnauthorizedError("You do not have permission to edit this user!"))
            };
            getRequest(url).catch(function(err) {
                console.log("get request error")
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(body){
                if(body.response.statusCode === 200){
                    mainBody = JSON.parse(body.body);
                    if(typeof req.params.firstname !== "undefined" && req.params.firstname) {
                        mainBody.firstname = req.params.firstname;
                    };
                    if(typeof req.params.surname !== "undefined" && req.params.surname) {
                        mainBody.surname = req.params.surname;
                    };
                    if(typeof req.params.city !== "undefined" && req.params.city) {
                        mainBody.city = req.params.city;
                    };
                    if(typeof req.params.dob !== "undefined" && req.params.dob) {
                        mainBody.dob = req.params.dob;
                    };
                    if(typeof req.params.password !== "undefined" && req.params.password) {
                        mainBody.password = sha1(req.params.password + salt);
                    };
                    var params = {
                        uri: url,
                        body: JSON.stringify(mainBody)
                    };
                }
                return params;
            }).then(function(params){
                request.put(params, function(err, response, content) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant Update CouchDB document'));
                    }
                    res.setHeader('Last-Modified', mainBody.last_modified);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    var sendBack = {
                        update: 'OK',
                        username: username,
                        firstname: mainBody.firstname,
                        surname: mainBody.surname,
                        city: mainBody.city,
                        dob: mainBody.dob
                    };
                    res.send(202, sendBack);
                    res.end();
                });
            });
        },
        updateBusiness: function(req, res, next){
            var businessname = req.params.businessname,
                url = 'http://localhost:5984/business/' + businessname,
                salt = rand(160, 36),
                mainBody = {};
            if(businessname !== req.authorization.basic.username){
                return next(new restify.UnauthorizedError("You do not have permission to edit this business!"))
            };
            getRequest(url).catch(function(err) {
                console.log("get request error")
                return next(new restify.InternalServerError('Error has occured'));
            }).then(function(body){
                if(body.response.statusCode === 200){
                    console.log("runnin param tests")
                    mainBody = JSON.parse(body.body);
                    console.log(mainBody);
                    if(typeof req.params.password !== "undefined" && req.params.password) {
                        mainBody.password = sha1(req.params.password + salt);
                    };
                    if(typeof req.params.address !== "undefined" && req.params.address) {
                        mainBody.address = req.params.address;
                    };
                    if(typeof req.params.city !== "undefined" && req.params.city) {
                        mainBody.city = req.params.city;
                    };
                    if(typeof req.params.postcode !== "undefined" && req.params.postcode) {
                        mainBody.postcode = req.params.postcode;
                    };
                    if(typeof req.params.longitude !== "undefined" && req.params.longitude) {
                        mainBody.longitude = req.params.longitude;
                    };
                    if(typeof req.params.latitude !== "undefined" && req.params.latitude) {
                        mainBody.latitude = req.params.latitude;
                    };
                    var params = {
                        uri: url,
                        body: JSON.stringify(mainBody)
                    };
                }
                return params;
            }).then(function(params){
                console.log(mainBody);
                request.put(params, function(err, response, content) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant Update CouchDB document'));
                    }
                    res.setHeader('Last-Modified', mainBody.last_modified);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    var sendBack = {
                        Update: 'OK',
                        businessname: businessname,
                        address: mainBody.address,
                        city: mainBody.surname,
                        postcode: mainBody.postcode,
                        longitude: mainBody.longitude,
                        latitude: mainBody.latitude
                    };
                    res.send(202, sendBack);
                    res.end();
                });
            });
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
    }
})();