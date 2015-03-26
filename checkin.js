var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    pwdCheck = require('./passwordCheck.js');

function checkin(req, res, next) {
    if(!req.params.business) {
        return next(new restify.NotAcceptableError('Business Not Found please supply a businessname in the query'));
    }
    // Get user and set couchdb url
    var username = req.authorization.basic.username,
        password = req.authorization.basic.password,
        business = req.params.business,
        userUrl = 'http://localhost:5984/users/' + username,
        businessUrl = 'http://localhost:5984/business/' + business,
        points = 0,
        credentials = true;
    //Get business doc to see how many points the user gets for checkin
    request.get(businessUrl, function(err, response, body) {
        if(response.statusCode === 404) {
            return next(new restify.NotFoundError('Business Not Found'));
        };
        if(response.statusCode === 200) {
            //Parse string into javascript object
            body = JSON.parse(body);
            points = body.checkin_points;
        }
        //New promise to check if username and password match the document
        pwdCheck.check(username, password, 'user').
        catch(function(err) {
            console.log(credentials + ' above')
            credentials = false;
            console.log(credentials + ' below')
            return next(new restify.UnauthorizedError('Invalid username/password'));
        }).then(function() {
            console.log(credentials + ' after promise catch')
            if(credentials === true) {
                console.log('CHECKIN ');
                console.log('PUT ' + username);
                request.get(userUrl, function(err, response, body) {
                    console.log("Request started.");
                    // if the document isnt found it will error
                    if(response.statusCode === 404) {
                        return next(new restify.NotFoundError('User Not Found'));
                    };
                    //If document is found it will proceed
                    if(response.statusCode === 200) {
                        console.log('Existing document.');
                        body = JSON.parse(body);
                        //Create timestamp for transaction
                        var d = new Date(),
                            date = d.toUTCString();
                        //Change what we need in the body e.g the points can probably add to the array aswell
                        body.last_modified = date;
                        body.points = body.points + points;
                        var totalPoints = body.points;
                        // adding the transactions to the array so we can keep track of them
                        body.transactions.push({
                            transactionid: uuid.v1(),
                            date: date,
                            amount_of_points: points,
                            checked_in_at: business
                        })
                        console.log(username + ' Added ' + body.points + ' points');
                        var params = {
                            uri: userUrl,
                            body: JSON.stringify(body)
                        };
                        //Put the new updated document
                        request.put(params, function(err, response, body) {
                            if(err) {
                                return next(new restify.InternalServerError('Cant create document'));
                            }
                            // document has been inserted into database
                            res.setHeader('Location', 'http://' + req.headers.host + '/users/' + username);
                            res.setHeader('Last-Modified', date);
                            res.setHeader('Content-Type', 'application/json');
                            res.setHeader('Accepts', 'PUT');
                            var sendBack = {
                                CheckIn: 'Ok',
                                username: username,
                                business: business,
                                points_added: points,
                                total_points: totalPoints
                            }
                            //Send back accepted with some params about the transaction
                            res.send(202, sendBack);
                            res.end();
                        });
                    };
                })
            }
        })
    })
};
module.exports.checkin = checkin;