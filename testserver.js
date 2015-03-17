exports.startserver = function() {
    var restify = require('restify');
    var server = restify.createServer();
   
    var test = require('./routes.js');
    
     console.log ('server '+ server)
    server.listen('8080', 'localhost', function() {
        test.getRoutes(server);
        console.log('%s server listen at %s', server.name, server.url);
    });
}