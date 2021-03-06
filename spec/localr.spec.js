 var request = require('request');
 var neo4j = require('node-neo4j');
 require('../testserver.js').startserver();
 jasmine.getEnv().defaultTimeoutInterval = 99999;
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
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
            
         })
     })
     describe('Users', function() {
         it("be able to create a user", function(done) {
             var url = 'http://localhost:8080/users';
             var doc = {
                 city: "Birmingham",
                 dob: "31.05.1991",
                 firstname: "Adam",
                 surname: "Holt",
                 email: "adamholt@me.com"
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.post(params, function(error, response, body) {
                 expect(response.statusCode).toBe(201);
                 body = JSON.parse(body);
                 expect(body.username).toBe('testuser');
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be not able to create duplicate user", function(done) {
             var url = 'http://localhost:8080/users';
             var doc = {
                 city: "Birmingham",
                 dob: "31.05.1991",
                 firstname: "Adam",
                 surname: "Holt",
                 email: "adamholt@me.com"
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
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
     describe('businesses', function() {
         it('able to create new business', function(done) {
             var url = 'http://localhost:8080/business';
             var doc = {
                 points: 50,
                 city: "coventry",
                 address: "blahhh",
                 postcode: "B23 5XR",
                 longitude: 40.000,
                 latitude: 1.020,
                 email: "adamholt@me.com"
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testbusiness', 'test'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.post(params, function(error, response, body) {
                 expect(response.statusCode).toBe(201);
                 body = JSON.parse(body);
                 expect(body.register).toBe('OK');
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it('should not be able to duplicate business', function(done) {
             var url = 'http://localhost:8080/business';
             var doc = {
                 points: 50,
                 city: "coventry",
                 address: "blahhh",
                 postcode: "B23 5XR",
                 longitude: 40.000,
                 latitude: 1.020,
                 email: "adamholt@me.com"
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testbusiness', 'test'),
                     "content-type": "application/json"
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
     describe('checkin', function() {
         it("be able to checkin", function(done) {
             var url = 'http://localhost:8080/users/checkin';
             var doc = {
                 business: "testbusiness",
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
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(202);
                 body = JSON.parse(body);
                 expect(body.CheckIn).toBe("Ok")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("should not be able to checkin with invalid credntials", function(done) {
             var url = 'http://localhost:8080/users/checkin';
             var doc = {
                 business: "testbusiness",
             };
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'wrongpass'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(401);
                 body = JSON.parse(body);
                 expect(body.message).toBe("Invalid username/password")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("check points have been added", function(done) {
             var url = 'http://localhost:8080/users/get/testuser';
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
                 expect(body.points).toBe(50);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to see where you've checked in", function(done) {
             var url = 'http://localhost:8080/users/get/testuser';
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
                 var trans = body.transactions;
                 expect(trans.length).toBeGreaterThan(0);
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
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
                            
                             done();
                         })
                     })
                 })
             });
         })
         it("be able to join a group", function(done) {
             var url = 'http://localhost:8080/users';
             var doc = {
                 city: "Birmingham",
                 dob: "11.01.1992",
                 firstname: "Reiss",
                 surname: "Jarvis",
                 email: "adamholt@me.com"
             }
             // getting the parameters
             // create new user first
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser2', 'test'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.post(params, function(error, response, body) {
                 //create group
            
                 var url = 'http://localhost:8080/groups'
                 var doc = {
                     username: "testuser2",
                     groupname: "testgroup2",
                     description: "This is a Test Group 2",
                     competition: "freshers"
                 };
            
                 var params = {
                     uri: url,
                     headers: {
                         authorization: getBasic('testuser2', 'test'),
                         "content-type": "application/json"
                     },
                     body: JSON.stringify(doc)
                 };
         
                 request.post(params, function(error, response, body) {
                     //join the group
                    
                     url = 'http://localhost:8080/groups/join/testgroup2'
                     var params = {
                         uri: url,
                         headers: {
                             authorization: getBasic('testuser', 'test'),
                             "content-type": "application/json"
                         }
                     };
                     request.post(params, function(error, response, body) {
                         expect(response.statusCode).toBe(201);
                        
                         if(error) {
                             expect(error.code).not.toBe('ECONNREFUSED');
                         }
                         done()
                     })
                 })
             });
         })
         it("Be able to get a single group", function(done) {
             var url = 'http://localhost:8080/groups/testgroup';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testbusiness', 'test'),
                     "content-type": "application/json"
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
         it("Be able to see all groups", function(done) {
             var url = 'http://localhost:8080/groups?competition=freshers';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
                 },
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 body = JSON.parse(body);
                 expect(body.total_groups).toBe(2);
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
                 cost: 25
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testbusiness', 'test'),
                     "content-type": "application/json"
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
         it("Be able to get the latest offers", function(done) {
             var url = 'http://localhost:8080/business/offers/all';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
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
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
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
         it("be able to redeem an offer", function(done) {
             var url = 'http://localhost:8080/business/offers/redeem';
             var doc = {
                 offerTitle: 'test offer - testbusiness'
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(202);
                 body = JSON.parse(body)
                 
                 expect(body.Redeem).toBe("OK")
                 expect(body.username).toBe("testuser")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("should not be able to redeem an offer with wrong credentials", function(done) {
             var url = 'http://localhost:8080/business/offers/redeem';
             var doc = {
                 offerTitle: 'test offer - testbusiness'
             }
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'wrong'),
                     "content-type": "application/json"
                 },
                 body: JSON.stringify(doc)
             };
             request.put(params, function(error, response, body) {
                 expect(response.statusCode).toBe(401);
                 body = JSON.parse(body);
                 expect(body.message).toBe("Invalid username/password")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
         it("be able to check what offers youve redeemed", function(done) {
             var url = 'http://localhost:8080/users/get/testuser';
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testuser', 'test')
                 },
             };
             request.get(params, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 body = JSON.parse(body);
                 expect(body.transactions[0].checked_in_at).toBe("testbusiness")
                 expect(body.transactions[1].business_redeemed).toBe("testbusiness")
                 if(error) {
                     expect(error.code).not.toBe('ECONNREFUSED');
                 }
                 done();
             })
         })
     })
     describe('delete all', function() {
         it("be able to delete the user", function(done) {
             var url = 'http://localhost:8080/users/testuser';
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
             var url = 'http://localhost:8080/business/testbusiness';
             // getting the parameters
             var params = {
                 uri: url,
                 headers: {
                     authorization: getBasic('testbusiness', 'test')
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
         it('delete group', function(done) {
             var url = 'http://localhost:8080/groups/testgroup';
             // getting the parameters
             request.del(url, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(response.body).toBe('"group deleted"')
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