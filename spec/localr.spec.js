 var request = require('request');
 describe('Localr API', function() {
     describe('Users', function() {
         describe('create the user', function(done) {
             //             beforeEach(function() {
             //                 var restify = require('restify');
             //                 var test = require('../register.js');
             //                 var server = restify.createServer();
             //                 test.init(server);
             //                 server.listen('8080', 'localhost', function() {
             //                     console.log('%s server listen at %s', server.name, server.url);
             //                 });
             //             })
             it("be able to create a user", function(done) {
                 var url = 'http://api.adam-holt.co.uk/users/testuser';
                 var doc = {
                     name: "testuser"
                 };
                 // getting params
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser', 'test')
                     },
                     body: JSON.stringify(doc)
                 };
                 request.post(params, function(error, response, body) {
                     expect(response.statusCode).toBe(200);
                     if(error) {
                         expect(error.code).not.toBe('ECONNREFUSED');
                     }
                     done();
                 })
             })
             it("be not able to create duplicate user", function(done) {
                 var url = 'http://api.adam-holt.co.uk/users/testuser';
                 var doc = {
                     name: "testuser"
                 };
                 // getting params
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser', 'test')
                     },
                     body: JSON.stringify(doc)
                 };
                 request.post(params, function(error, response, body) {
                     expect(response.statusCode).toBe(409);
                     if(error) {
                         expect(error.code).not.toBe('ECONNREFUSED');
                     }
                     done();
                 })
             })
         })
     })
     describe('checkin', function(done) {
         it("be able to checkin", function(done) {
             var url = 'http://api.adam-holt.co.uk/users/checkin?username=testuser&points=10';
             var doc = {
                 username: "testuser",
                 points:10
             };
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
                 body: JSON.stringify(doc)
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("check points have been added", function() {})
     })
     it("be able to see where you've checked in", function() {})
     it("be able to create a group", function() {})
     it("be able to delete a group", function() {})
     it("be able to join a group", function() {})
     it("Be able to get the latest offers", function() {})
     it("be able to redeem the latest offer", function() {})
     it("be able to check what offers youve redeemed", function() {})
     it("be able delete yourself", function(done) {
         var url = 'http://api.adam-holt.co.uk/users/testuser';
         // getting params
         console.log('at delete')
         var params = {
             uri: url,
             headers: {
                 authorization: getBasic('testuser', 'test')
             },
         };
         request.del(params, function(error, response, body) {
             expect(response.statusCode).toBe(200);
             if(error) {
                 expect(error.code).not.toBe('ECONNREFUSED');
             }
             done();
         })
     })
 });
 getBasic = function(username, password) {
     return "Basic " + new Buffer(username + ":" + password).toString('base64')
 };