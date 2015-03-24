exports.startserver = function() {
    var restify = require('restify');
    var server = restify.createServer();
    server.use(restify.CORS({
    origins: ['*'], // defaults to ['*']
    credentials: true, // defaults to false
    headers: ['authorization', 'content-type', 'accept', 'origin'],
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'] // sets expose-headers
}));
     server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(restify.authorizationParser());
    var test = require('./routes.js');
    test.getRoutes(server);
    server.listen('8080', 'localhost', function() {
        console.log('%s server listen at %s', server.name, server.url);
    });
}