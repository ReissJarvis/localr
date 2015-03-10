 var request = require('request');
 require('../testserver.js').startserver();
 describe('Localr API', function() {
     describe('test local connection', function() {
         it('make connection to server', function(done) {

             var url = 'http://localhost:8080/users/test';
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 }
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
             "connection works"
         })
     })
     describe('Users', function() {
         describe('create the user', function() {
             it("be able to create a user", function(done) {
                 var url = 'http://localhost:8080/users/register';
                 // getting params
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser', 'test')
                     }
                 };
                 request.post(params, function(error, response, body) {
                     expect(response.statusCode).toBe(201);
                     body = JSON.stringify(body)
                     expect(body.Username).toBe("testuser")
                     if(error) {
                         expect(error.code).not.toBe('ECONNREFUSED');
                     }
                     done();
                 })
             })
             it("be not able to create duplicate user", function(done) {

                 var url = 'http://127.0.0.1:8080/users/register';
                 // getting params
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser', 'test')
                     }
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
     describe('checkin', function() {
         it("be able to checkin", function(done) {

             var url = 'http://127.0.0.1:8080/users/checkin?username=testuser&points=10';
             var doc = {
                 username: "testuser",
                 points: 10
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
         it("check points have been added", function(done) {

             var url = 'http://127.0.0.1:8080/users/testuser';
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 }
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 body = JSON.parse(body);
                 expect(body.points).toBe(10);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to see where you've checked in", function() {

         })
     })
     describe("groups", function() {

         it("be able to create a group", function(done) {
             var url = 'http://127.0.0.1:8080/users/groups';
             var doc = {
                 username: "testuser",
                 description: "testgroup",
                 competition: "freshers"
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
                 expect(response.statusCode).toBe(201);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to join a group", function(done) {
             var url = 'http://127.0.0.1:8080/users/groups/testgroup';
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to delete a group", function(done) {
             var url = 'http://127.0.0.1:8080/users/groups';
             var doc = {
                 username: "testuser",
                 groupname: "testgroup",
                 description: "testgroup",
                 competition: "freshers"
             };
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
                 body: JSON.stringify(doc)
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
     describe('businesses', function() {
         it('able to create new business', function(done) {

             var url = 'http://127.0.0.1:8080/';
             // getting the parameters
             // 
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(201);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it('be able to create an offer', function(done) {
             var url = 'http://127.0.0.1:8080/';
             // getting the parameters
             // 
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(201);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it('cant create duplicate offer', function(done) {

             var url = 'http://127.0.0.1:8080/';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
     })
     describe('Offers', function() {
         it("Be able to get the latest offers", function(done) {
             var url = 'http://127.0.0.1:8080/business/offers/';
             // getting params

             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to get a businesses offers", function(done) {
             var url = 'http://127.0.0.1:8080/business/offers/testbusiness';
             // getting params
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
     })
     it("be able to check what offers youve redeemed", function() {})
     describe('delete all', function() {
         it("be able delete the user", function(done) {
             var url = 'http://127.0.0.1:8080/users/testuser';
             // getting params
             // 

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
         it('be able to delete the business', function(done) {
             var url = 'http://127.0.0.1:8080/';
             // getting the parameters
             // 
 
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
         it('delete offers', function() {})
         it('delete group', function() {})
     })
 });
 getBasic = function(username, password) {
     return "Basic " + new Buffer(username + ":" + password).toString('base64')
 };