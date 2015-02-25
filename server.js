//All working 23/2/15 - 3pm
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer({
        name: "localr"
    }),
    uuid = require('node-uuid'),
    getDetails = require("./getDetails.js"),
    checkin = require("./checkin.js"),
    register = require("./register.js"),
    del = require("./del.js");
// Setting server dependancys
server.use(restify.CORS({
    origins: ['*'], // defaults to ['*']
    credentials: true, // defaults to false
    headers: ['authorization', 'content-type', 'accept', 'origin'],
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'] // sets expose-headers
}));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());
restify.CORS.ALLOW_HEADERS.push('authorization');
// Creating Server
server.listen(8080, function() {
    var users = "/users",
        business = "/business";
    console.log('Incoming request being handled.');
    // Get details for user
    server.get({path : users + "/get"}, function(req, res, next) {
        getDetails.getDetails(req, res, next, 'users');
    });
    // Get details for business
    server.get({path : business + "/get"}, function(req, res, next) {
        getDetails.getDetails(req, res, next, 'business');
    });
    //Register user
    server.put({path : users + "/register"}, function(req, res, next) {
        register.register(req, res, next, 'users');
    });
    // Register business.
    server.put({path : business + "/register"}, function(req, res, next){
        register.register(req, res, next, 'business');
    });
    // The way this works is by having there name in at the moment e.g DOMAIN/checkin?user=USERNAME&location=7817587295719 This will then add 10 points at the moment
    server.put({path : users + "/checkin"}, function(req, res, next) {
        checkin.checkin(req,res,next);
    });
    // Delete user
    server.del({path: users + "/delete"}, function(req, res, next){
        del.del(req, res, next, 'users'); 
    });
    // Delete business
    server.del({path: users + "/delete"}, function(req, res, next){
        del.del(req, res, next, 'business'); 
    });
});