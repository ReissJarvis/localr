exports.startserver = function() {
    var restify = require('restify');
    var server = restify.createServer();
    var test = require('./routes.js');
    test.getRoutes(server);
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(restify.authorizationParser());
    console.log('server ' + server)
    server.listen('8080', 'localhost', function() {
        console.log('%s server listen at %s', server.name, server.url);
    });
}