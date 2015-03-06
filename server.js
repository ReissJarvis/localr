//All working 23/2/15 - 3pm
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer({
        name: "localr"
    })
    uuid = require('node-uuid'),
    getDetails = require("./getDetails.js"),
    checkin = require("./checkin.js"),
    register = require("./register.js"),
    del = require("./del.js");
    groups = require("./groups.js"),
    offer = require("./offers.js");
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

//Some error handling
server.on('NotFound', function (request, response, cb) {});              // When a client request is sent for a URL that does not exist, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 404 handler. It is expected that if you listen for this event, you respond to the client.
server.on('MethodNotAllowed', function (request, response, cb) {});      // When a client request is sent for a URL that does exist, but you have not registered a route for that HTTP verb, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 405 handler. It is expected that if you listen for this event, you respond to the client.
server.on('VersionNotAllowed', function (request, response, cb) {});     // When a client request is sent for a route that exists, but does not match the version(s) on those routes, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 400 handler. It is expected that if you listen for this event, you respond to the client.
server.on('UnsupportedMediaType', function (request, response, cb) {});  // When a client request is sent for a route that exist, but has a content-type mismatch, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 415 handler. It is expected that if you listen for this event, you respond to the client.
server.on('after', function (request, response, route, error) {});       // Emitted after a route has finished all the handlers you registered. You can use this to write audit logs, etc. The route parameter will be the Route object that ran.
server.on('uncaughtException', function (request, response, route, error) {});  // Emitted when some handler throws an uncaughtException somewhere in the chain. The default behavior is to just call res.send(error), and let the built-ins in restify handle transforming, but you can override to whatever you want here.
 
// Creating Server
server.listen(8080, function() {
    var users = "/users",
        business = "/business",
        offers = '/offers'
    console.log('Incoming request being handled.');
    // Get details for user
    server.get({path : users + "/:username"}, function(req, res, next) {
        getDetails.getDetails(req, res, next, 'users');
    });
    // Get details for business
    server.get({path : business + "/:businessname"}, function(req, res, next) {
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
    server.del({path: business + "/delete"}, function(req, res, next){
        del.del(req, res, next, 'business'); 
     });   
    //user/creategroup?username=username&groupname=name&description=description&competition=freshers
    server.put({path: users + "/creategroup"}, function(req, res, next) {
        groups.creategroup(req,res,next);
    });
    //?username=username&groupname=test21
    server.get({path: users + "/getgroup"}, function(req, res, next) {
        groups.showgroup(req,res,next);
    });
    //?username=username&competition=freshers
    server.get({path: users + "/getgroups"}, function(req, res, next) {
        groups.showcompetitiongroup(req,res,next);
    });
    //?username=username&groupname=test21
     server.put({path: users + "/joingroup"}, function(req, res, next) {
        groups.joinGroup(req,res,next);
    });
    //Create Offer
    server.put({path : business + offers}, function(req, res, next) {
        offer.addOffer(req, res, next);
    });
    //Get all Offers
    server.get({path : business + offers + '/:businessname'}, function(req, res, next) {
        offer.getAllOffers(req, res, next);
    });
});