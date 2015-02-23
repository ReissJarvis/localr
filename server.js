// Adam testing git is working on the VPS
// Were also not using Python hahaha no #####
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer(),
    uuid = require('node-uuid'),
    getuser = require("./getuser.js"),
    checkin = require("./checkin.js"),
    register = require("./register.js");
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
    console.log('Incoming request being handled.');
    server.get(/^\/users\/([a-z]+)$/, function(req, res, next) {
        getuser.getuser(req,res,next);
    });
    //Register a new user just a simple check if it exists if not, adding by creating the json and pushing it to couchdb
    server.put(/^\/register\/([a-z]+)$/, function(req, res, next) {
        register.register(req,res,next);
    });
    // The way this works is by having there name in at the moment e.g DOMAIN/checkin?user=USERNAME&location=7817587295719 This will then add 10 points at the moment
    server.put("/checkin", function(req, res, next) {
        checkin.checkin(req,res,next);
        console.log('in server.js'+req.params[0]);
    });
});