var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');

function register(req, res, next, type) {
    if(type == "users") {
        //Get new username from authorization header
        var username = req.authorization.basic.username;
        //Start of extra details of User
        var city = req.params.city,
            dob = req.params.dob,
            firstname = req.params.firstname,
            surname = req.params.surname,
        // setting console logs to node server
        console.log('NEW USER!');
        console.log('PUT: ' + username);
        db = new neo4j('http://localhost:7474');
        //set up global variables
        var nodeid = 0;
        var url = 'http://localhost:5984/users/' + username;
        //start of get request
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Could not get user from CouchDB'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode);
            if(response.statusCode === 200) {
                return next(new restify.ConflictError('user already created'));
            } else if(response.statusCode === 404) {
                //Insert new node to neo4j
                db.insertNode({
                    name: username
                }, ['User'], function(err, node) {
                    //start of node request
                    if(err) throw err;
                    
                    nodeid = node._id
                    // create variables for couchdb
                    var salt = rand(160, 36),
                        password = sha1(req.authorization.basic.password + salt),
                        d = new Date(),
                        date = d.toUTCString();
                    //Create document for couchDB
                    var doc = {
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
                        surname: surname
                    };
                    // compile the json file
                    var docStr = JSON.stringify(doc);
                    //Build request
                    var params = {
                        uri: url,
                        body: JSON.stringify(doc)
                    };
                    //Put doc to CouchDB
                    request.put(params, function(err, response, body) {
                        // start of couch db 
                        if(err) {
                            return next(new restify.InternalServerError('Cant create document'));
                        }
                        // document has been inserted into database
                        var sendBack = {
                            Registered: 'OK',
                            Username: username,
                            Date_Joined: date,
                            url : "api.adam-holt.co.uk/users/" + username
                        }
                        //Send back successful response
                        res.send(201,sendBack);
                        res.end();
                        // end of couchdb callback
                    });
                // end of node callback   
                });
               // end of 404 if statement
            };
            // if the document is found, that means the user is already created.
        });
    } else if(type == "business") {
        //Get the business username from their basic http auth
        var businessName = req.authorization.basic.username;
        //The amount of points a user will get for checking in
        var points = req.params.points;
        //Start of extra details of Business
        var address = req.params.city,
            city = req.params.city,
            postcode = req.params.postcode,
            longitude = req.params.longitude,
            latitude = req.params.latitude;
        console.log('NEW BUSINESS!');
        console.log('PUT: ' + businessName);
        //Connecting to neo4j host
        var db = new neo4j('http://localhost:7474');
        var nodeid = 0;
        //CouchDB URL
        var url = 'http://localhost:5984/business/' + businessName;
        //Make a request to CouchDB
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode);
            if(response.statusCode === 200) {
                return next(new restify.ConflictError('user already created'));
            } else if(response.statusCode === 404) {
                //Insert new node to neo4j
                db.insertNode({
                    name: businessName
                }, ['Business', businessName], function(err, node) {
                    if(err) throw err;
                    // Output node properties.

                    nodeid = node._id
                    var salt = rand(160, 36),
                        password = sha1(req.authorization.basic.password + salt),
                        d = new Date(),
                        date = d.toUTCString();
                    //Create document for couchDB
                    var doc = {
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
                        longitude: longitude
                    };
                    var docStr = JSON.stringify(doc);
                    //Build request
                    var params = {
                        uri: url,
                        body: JSON.stringify(doc)
                    };
                    //Put doc to CouchDB
                    request.put(params, function(err, response, body) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant create document'));
                        }
                        // document has been inserted into database
                        var sendBack = {
                            Registered: 'OK',
                            Business_Name: businessName,
                            Date_Joined: date
                        }
                        //Send back successful response
                        res.send(sendBack);
                        res.end();
                        // end of couch db callback
                    });
                // end of node call back
                });
                // end of 404
            }
        });
        // if the document is found, that means the user is already created.
    } else {
        // if invalid type has been entered user/business
        console.log("Error, Invalid Type!");
    };
};
module.exports.register = register;