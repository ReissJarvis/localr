 var request = require('request');
 var neo4j = require('node-neo4j');
 require('../testserver.js').startserver();
 describe('Localr API', function() {
     describe('test local connection', function() {
         it('make connection to server', function(done) {
             var url = 'http://localhost:8080/users/test';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 }
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(body).toBe('"works"');
                 console.log(body)
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
             console.log("connection works")
         })
     })
     describe('Users', function() {
         describe('create the user', function() {
             it("be able to create a user", function(done) {
                 var url = 'http://localhost:8080/users';
                 // getting the parameters
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser', 'test')
                     }
                 };
                 request.post(params, function(error, response, body) {
                     expect(response.statusCode).toBe(201);
                     body = JSON.parse(body);
                     expect(body.Username).toBe('testuser');
                     expect(body.url).toBe('api.adam-holt.co.uk/users/testuser');
                     if(error) {
                         expect(error.code).not.toBe('ECONNREFUSED');
                     }
                     done();
                 })
             })
             it("be not able to create duplicate user", function(done) {
                 var url = 'http://localhost:8080/users';
                 // getting the parameters
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
             var url = 'http://localhost:8080/users/checkin?username=testuser&points=10';
             var doc = {
                 username: "testuser",
                 points: 10
             };
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
                 body: JSON.stringify(doc)
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(response.body).toBe("{'Points added':'10'}")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("check points have been added", function(done) {
             var url = 'http://localhost:8080/users/testuser';
             // getting the parameters
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
         it("be able to see where you've checked in", function() {})
     })
     describe("groups", function() {
         it("be able to create a group", function(done) {
             var db = new neo4j('http://localhost:7474');
             var url = 'http://localhost:8080/groups'
             var doc = {
                 username: "testuser",
                 groupname: "testgroup",
                 description: "This is a Test Group",
                 competition: "freshers"
             };
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             // create the competition node
             db.insertNode({
                 name: "freshers"
             }, ['competition'], function(err, node) {
                 if(err) throw err;
                 request.post(params, function(error, response, body) {
                     expect(response.statusCode).toBe(201);
                     if(error) {
                         expect(error.code).not.toBe('ECONNREFUSED');
                     }
                     db.cypherQuery(" MATCH (n:Group) WHERE n.name ='testgroup' RETURN n", function(err, Results) {
                         if(err) throw err;
                         expect(Results.data[0].name).toBe('testgroup');
                         db.cypherQuery(" MATCH n-[r]->m RETURN n,r,m", function(err, Results) {
                             if(err) throw err;
                             console.log("getting relationships")
                             console.log(Results)
                             done();
                         })
                     })
                 })
             });
         })
         it("be able to join a group", function(done) {
             var url = 'http://localhost:8080/users';
             // create new user first
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser2', 'test')
                 }
             };
             // make a new user
             request.post(params, function(error, response, body) {
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 var db = new neo4j('http://localhost:7474');
                 var url = 'http://localhost:8080/groups'
                 var doc = {
                     username: "testuser2",
                     groupname: "testgroup2",
                     description: "This is a Test Group 2",
                     competition: "freshers"
                 };
                 // getting the parameters
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser2', 'test'),
                         "content-type": "application/json"
                     },
                     body: JSON.stringify(doc)
                 };
                 // create the competition node
                 if(err) throw err;
                 request.post(params, function(error, response, body) {
                     var params = {
                         uri: url,
                         headers: {
                             authorization: getBasic('testuser', 'test'),
                         },
                     };
                     request.post(params, function(error, response, body) {
                         url = 'http://localhost:8080/groups/join/testgroup2'
                         request.post(params, function(error, response, body) {
                             expect(response.statusCode).toBe(201);
                             console.log("join group" + body)
                             if(error) {
                                 expect(error.code).not.toBe('ECONNREFUSED');
                             }
                             done()
                         })
                     })
                 })
             });
         })
     })
     it("be able to delete a group", function(done) {
         var url = 'http://localhost:8080/groups/testgroup';
         // getting the parameters
         request.del(url, function(error, response, body) {
             expect(response.statusCode).toBe(200);
             expect(response.body).toBe("group deleted")
             if(error) {
                 expect(error.code).not.toBe('ECONNREFUSED');
             }
             done();
         })
     })
     describe('businesses', function() {
         it('able to create new business', function(done) {
             var url = 'http://localhost:8080/business';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testBusinesses', 'test')
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
     })
     describe('Offers', function() {
         it("Be able to add an offer", function(done) {
             var url = 'http://localhost:8080/business/offers';
             var doc = {
                 businessname: 'testbusiness',
                 description: 'description',
                 title: 'test offer',
                 cost: 50
             }
             // getting the parameters
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
         it("Be able to get the latest offers", function(done) {
             var url = 'http://localhost:8080/business/offers/all';
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
         it("be able to get a businesses offers", function(done) {
             var url = 'http://localhost:8080/business/offers/testbusiness';
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
     it("be able to check what offers youve redeemed", function() {})
     describe('delete all', function() {
         it("be able to delete the user", function(done) {
             var url = 'http://localhost:8080/users';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.del(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(body).toBe('"Deleted User!"')
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it('be able to delete the business', function(done) {
             var url = 'http://localhost:8080/business';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testBusiness', 'test')
                 },
             };
             request.del(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(body).toBe('"Deleted Business!"')
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it('delete offers', function(done) {
             var url = 'http://localhost:8080/business/offers';
             // getting the parameters
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
         it('delete group', function(done) {
             var url = 'http://localhost:8080/business';
             // getting the parameters
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
 })
 getBasic = function(username, password) {
     return "Basic " + new Buffer(username + ":" + password).toString('base64')
 };