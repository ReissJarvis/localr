var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    server = restify.createServer({
        name: "localr"
    });
var uuid = require('node-uuid');

// Setting server dependancys
server.use(restify.CORS({
    origins: ['*'], // defaults to ['*']
    credentials: true, // defaults to false
    headers: ['authorization', 'content-type', 'accept', 'origin'],
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'] // sets expose-headers
}));
routes = require('./routes.js')
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());
restify.CORS.ALLOW_HEADERS.push('authorization');
// //Some error handling
// server.on('NotFound', function(request, response, next) {}); // When a client request is sent for a URL that does not exist, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 404 handler. It is expected that if you listen for this event, you respond to the client.
// server.on('MethodNotAllowed', function(request, response, cb) {}); // When a client request is sent for a URL that does exist, but you have not registered a route for that HTTP verb, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 405 handler. It is expected that if you listen for this event, you respond to the client.
// server.on('VersionNotAllowed', function(request, response, cb) {}); // When a client request is sent for a route that exists, but does not match the version(s) on those routes, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 400 handler. It is expected that if you listen for this event, you respond to the client.
// server.on('UnsupportedMediaType', function(request, response, cb) {}); // When a client request is sent for a route that exist, but has a content-type mismatch, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 415 handler. It is expected that if you listen for this event, you respond to the client.
// server.on('after', function(request, response, route, error) {}); // Emitted after a route has finished all the handlers you registered. You can use this to write audit logs, etc. The route parameter will be the Route object that ran.
// server.on('uncaughtException', function(request, response, route, error) {}); // Emitted when some handler throws an uncaughtException somewhere in the chain. The default behavior is to just call res.send(error), and let the built-ins in restify handle transforming, but you can override to whatever you want here.
// Creating Server
server.listen(8080, function() {
 console.log('%s server listen at %s', server.name, server.url);
    routes.getRoutes(server);
});