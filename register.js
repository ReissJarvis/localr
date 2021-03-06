var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j'),
    Promise = require('promise');
module.exports.register = (function() {
    var db = new neo4j('http://localhost:7474');
    return {
        registerUser: function(req, res, next) {
            console.log('POST USER ' + req.authorization.basic.username)
            var username = req.authorization.basic.username,
                city = req.params.city,
                dob = req.params.dob,
                firstname = req.params.firstname,
                surname = req.params.surname,
                email = req.params.email,
                nodeid = 0,
                url = 'http://localhost:5984/users/' + username;
            if(!this.checkUser(username, city, dob, firstname, surname, email)) {
                return next(new restify.NotAcceptableError('Not all requirements supplied!'));
            };
            this.getRequest(url).
            catch(function(err) {
                console.log("Get request error");
                return next(new restify.InternalServerError('Error has occured getting CouchDB document!'));
            }).then(function(body) {
                if(body.response.statusCode === 200) {
                    return next(new restify.ConflictError('User already exists!'));
                } else if(body.response.statusCode === 404) {
                    return new Promise(function(resolve, reject) {
                        db.insertNode({
                            name: username
                        }, ['User', username], function(err, node) {
                            if(err) throw err;
                            nodeid = node._id;
                            resolve(node._id);
                        });
                    }).then(function(nodeid) {
                        var salt = rand(160, 36),
                            password = sha1(req.authorization.basic.password + salt),
                            d = new Date(),
                            date = d.toUTCString(),
                            doc = {
                                date_joined: date,
                                last_modified: date,
                                password: password,
                                salt: salt,
                                points: 0,
                                transactions: [],
                                nodeid: nodeid,
                                city: city,
                                dob: dob,
                                firstname: firstname,
                                surname: surname,
                                email: email
                            },
                            params = {
                                uri: url,
                                body: JSON.stringify(doc)
                            };
                        request.put(params, function(err, response, content) {
                            if(err) {
                                return next(new restify.InternalServerError('Cant Update CouchDB document'));
                            }
                            res.setHeader('Last-Modified', date);
                            res.setHeader('Content-Type', 'application/json');
                            res.setHeader('Accepts', 'POST');
                            var sendBack = {
                                register: 'OK',
                                date_joined: date,
                                last_modified: date,
                                nodeid: nodeid,
                                username: username,
                                firstname: firstname,
                                surname: surname,
                                city: city,
                                dob: dob,
                                email: email
                            };
                            res.send(201, sendBack);
                            res.end();
                        });
                    })
                }
            })
        },
        registerBusiness: function(req, res, next) {
            var businessname = req.authorization.basic.username,
                points = req.params.points,
                address = req.params.address,
                city = req.params.city,
                postcode = req.params.postcode,
                longitude = req.params.longitude,
                latitude = req.params.latitude,
                email = req.params.email,
                nodeid = 0,
                url = 'http://localhost:5984/business/' + businessname;
            if(!this.checkBusiness(businessname, points, address, city, postcode, longitude, latitude, email)) {
                return next(new restify.NotAcceptableError('Not all requirements supplied!'));
            };
            this.getRequest(url).
            catch(function(err) {
                console.log("Get request error");
                return next(new restify.InternalServerError('Error has occured getting CouchDB document!'));
            }).then(function(body) {
                if(body.response.statusCode === 200) {
                    return next(new restify.ConflictError('User already exists!'));
                } else if(body.response.statusCode === 404) {
                    return new Promise(function(resolve, reject) {
                        db.insertNode({
                            name: businessname
                        }, ['Business', businessname], function(err, node) {
                            if(err) throw err;
                            nodeid = node._id;
                            resolve(node._id);
                        });
                    }).then(function(nodeid) {
                        var salt = rand(160, 36),
                            password = sha1(req.authorization.basic.password + salt),
                            d = new Date(),
                            date = d.toUTCString(),
                            doc = {
                                date_joined: date,
                                last_modified: date,
                                password: password,
                                salt: salt,
                                nodeid: nodeid,
                                checkin_points: points,
                                address: address,
                                city: city,
                                postcode: postcode,
                                latitude: latitude,
                                longitude: longitude,
                                email: email
                            },
                            params = {
                                uri: url,
                                body: JSON.stringify(doc)
                            };
                        request.put(params, function(err, response, content) {
                            if(err) {
                                return next(new restify.InternalServerError('Cant Update CouchDB document'));
                            }
                            res.setHeader('Last-Modified', date);
                            res.setHeader('Content-Type', 'application/json');
                            res.setHeader('Accepts', 'POST');
                            var sendBack = {
                                register: 'OK',
                                date_joined: date,
                                last_modified: date,
                                nodeid: nodeid,
                                checkin_points: points,
                                address: address,
                                city: city,
                                postcode: postcode,
                                longitude: longitude,
                                latitude: latitude,
                                email: email
                            };
                            res.send(201, sendBack);
                            res.end();
                        });
                    })
                }
            })
        },
        getRequest: function(url) {
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) reject(err);

                    resolve({
                        response: response,
                        body: body
                    })
                })
            });
        },
        checkUser: function(u, c, d, f, s, e) {
            if(typeof u == "undefined") {
                return false;
            } else if(typeof c == "undefined") {
                return false;
            } else if(typeof d == "undefined") {
                return false;
            } else if(typeof f == "undefined") {
                return false;
            } else if(typeof s == "undefined") {
                return false;
            } else if(typeof e == "undefined") {
                return false;
            } else {
                return true;
            };
            return true;
        },
        checkBusiness: function(bus, pon, add, cit, pos, lon, lat, ema) {
            if(typeof bus == "undefined") {
                return false;
            } else if(typeof pon == "undefined") {
                return false;
            } else if(typeof add == "undefined") {
                return false;
            } else if(typeof cit == "undefined") {
                return false;
            } else if(typeof pos == "undefined") {
                return false;
            } else if(typeof lon == "undefined") {
                return false;
            } else if(typeof lat == "undefined") {
                return false;
            } else if(typeof ema == "undefined") {
                return false;
            } else {
                return true;
            };
        }
    };
})();