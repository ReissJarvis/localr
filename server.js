//All working 23/2/15 - 3pm
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer({
        name: "localr"
    }),
    uuid = require('node-uuid'),
    getuser = require("./getuser.js"),
    checkin = require("./checkin.js"),
    register = require("./register.js");
    groups = require("./groups.js");
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
    server.get("/users", function(req, res, next) {
        getuser.getuser(req,res,next);
    });
    //Register a new user just a simple check if it exists if not, adding by creating the json and pushing it to couchdb
    server.put("/register", function(req, res, next) {
        register.register(req,res,next);
    });
    // The way this works is by having there name in at the moment e.g DOMAIN/checkin?user=USERNAME&location=7817587295719 This will then add 10 points at the moment
    server.put("/checkin", function(req, res, next) {
        checkin.checkin(req,res,next);
    });
    //user/creategroup?groupname = name&description=description&competition=freshers
    server.put("/users/creategroup", function(req, res, next) {
        groups.creategroup(req,res,next);
    });
});