var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid');

function checkin(req, res, next) {
    if (!req.params.business){
        return next(new restify.NotAcceptableError('Business Not Found please supply a businessname in the query'));
    }
    // Get user and set couchdb url
    var user = req.authorization.basic.username,
        business = req.params.business,
        userUrl = 'http://localhost:5984/users/' + user,
        businessUrl = 'http://localhost:5984/business/' + business,
        points = 0;
    
    //Get business doc to see how many points the user gets for checkin
    request.get(businessUrl, function (err, response, body) {
        if (response.statusCode === 404) {
                return next(new restify.NotFoundError('Business Not Found'));
        };
        if (response.statusCode === 200) {
            //Parse string into javascript object
            body = JSON.parse(body);
            points = body.checkin_points;
        }
    });
    console.log('CHECKIN ');
    console.log('PUT ' + user);
    request.get(userUrl, function (err, response, body) {
            console.log("Request started.");
            // if the document isnt found it will create it from sratch
            if (response.statusCode === 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if (response.statusCode === 200) {
                console.log('Existing document.');
                body = JSON.parse(body);
                var pwd = sha1(req.authorization.basic.password + body.salt);
                if(pwd != body.password) {
                    return next(new restify.ForbiddenError('Invalid username/password.'));
                }
                console.log('Passwords match!');
                var d = new Date(),
                    date = d.toUTCString();
                // change what we need in the body e.g the points can probably add to the array aswell
                body.last_modified = date;
                body.points = body.points + points;
                var totalPoints = body.points;
                // adding the transactions to the array so we can keep track of them
                body.transactions.push({
                    transactionid: uuid.v1(),
                    date: date,
                    amount_of_points: points
                })
                console.log(body.points);
                var params = {
                    uri: userUrl,
                    body: JSON.stringify(body)
                };
                request.put(params, function (err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant create document'));
                    }
                    // document has been inserted into database
                    res.setHeader('Location', 'http://' + req.headers.host + req.url);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'PUT');
                    var sendBack = {
                        CheckIn: 'Ok',
                        username: user,
                        business: business,
                        points_added: points,
                        total_points: totalPoints
                    }
                    res.send(202,sendBack);
                    res.end();
                });
            };
        })
   
};
module.exports.checkin = checkin;