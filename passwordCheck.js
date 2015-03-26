var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1');
//Module to check password is the same
module.exports.check = (function(username, password, type) {
    if(type == "business") {
        var url = "http://localhost:5984/business/" + username;
    } else {
        var url = "http://localhost:5984/users/" + username;
    }
    request.get(url, function(err, response, body) {
        if(err) {
            return next(new restify.InternalServerError('Cant GET CouchDB document to check for password'));
        };
        //Get the password and salt from the document to check against the credentials supplied
        body = JSON.parse(body)
        var pwd = sha1(password + body.salt);
        if(pwd != body.password) {
            //If they don't match then return an error
            return next(new restify.UnauthorizedError('Invalid username/password'));
            return false
        } else {
            //If they do match return true
            return true
        }
    })
})();