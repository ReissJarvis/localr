var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    Promise = require('promise');

module.exports.update = function(req, res ,next, type){
    if(type == "users") {
        console.log("Updating: " + username);
        var username = req.authorization.basic.username,
            url = 'http://localhost:5984/users/' + username;
        request.get(url, function(err, response, body) {
            if(response.statusCode === 404) {
                return next(new restify.NotFoundError('User Not Found'));
            };
            if(response.statusCode === 200) {
                body = JSON.parse(body);
                
            };
        });   
    } else if (type == "business"){
        
    } else {
        
    };
};