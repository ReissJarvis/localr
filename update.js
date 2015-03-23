var validateHTTP = require("./validateHTTP.js"),
    restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    Promise = require('promise');

module.exports.update = function(req, res ,next, type){
    if(type == "users") {
        
    } else if (type == "business"){
        
    } else {
        
    };
};