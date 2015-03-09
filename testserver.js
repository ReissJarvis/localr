exports.startserver = function() {
    var restify = require('restify');
    var test = require('./routes.js');
    var server = restify.createServer();
    test.init(server);
    server.listen('8080', 'localhost', function() {
        console.log('%s server listen at %s', server.name, server.url);
    });
}