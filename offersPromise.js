//Rebuilding to promises
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j'),
    Promise = require('promise'),
    pwdCheck = require('./passwordCheck.js');
module.exports.offers = (function() {
    //Some handy variables
    var rand = uuid.v1(),
        db = new neo4j('http://localhost:7474');
    return {
        addOffer: function(req, res, next) {
            console.log('NEW OFFER!');
            //Set variables from params
            var businessName = req.params.businessname;
            var password = req.authorization.basic.password;
            var description = req.params.description;
            var offertitle = req.params.title + ' - ' + businessName;
            var offerCost = req.params.cost;
            var nodeid = 0;
            //Build date and time
            var d = new Date();
            var date = d.toUTCString();
            //URL for when offer will be stored in CouchDB
            var url = 'http://localhost:5984/offers/' + offertitle;
            var credentials = true;
            //Make sure the business is only adding for their own business
            if (businessName !== req.authorization.basic.username){
                return next(new restify.UnauthorizedError('You must only add your own offers'));
            };
            //Check username and password is correct
            pwdCheck.check(businessName, password, 'business').
            catch(function(err) {
                credentials = false;
                return next(new restify.UnauthorizedError('Invalid username/password'));
            }).then(function() {
                //Only add offer is business password is accepted
                if(credentials === true) {
                    return new Promise(function(resolve, reject) {
                        //Get the offer from CouchDB
                        request.get(url, function(err, response, body) {
                            if(err) {
                                reject(err)
                            };
                            // if the document isnt found it will create it from sratch
                            console.log('code ' + response.statusCode)
                            if(body) {
                                resolve({
                                    response: response,
                                    body: body
                                })
                            }
                        })
                    }).
                    catch(function(err) {
                        //If there is a error getting the document from within the promise
                        console.log("GET request error on couchDB document")
                        return next(new restify.InternalServerError('Error communicating with CouchDB'));
                    }).then(function(call) {
                        // if the document isnt found it will create it from sratch
                        console.log('CouchDB request statuscode - ' + call.response.statusCode)
                        if(call.response.statusCode === 200) {
                            return next(new restify.ConflictError('Offer has already been created with the same name'));
                        }
                        return new Promise(function(resolve, reject) {
                            //Insert node into neo4j
                            if(call.response.statusCode === 404) {
                                //Insert node into neo4j
                                db.insertNode({
                                    name: offertitle
                                }, ['Offer', businessName], function(err, node) {
                                    if(err) throw err;
                                    // Output node properties.
                                    console.log('New neo4j node created with name = ' + node.name);
                                    nodeid = node._id
                                })
                                //Create the document
                                var doc = {
                                    date_created: date,
                                    last_modified: date,
                                    offer_title: offertitle,
                                    offer_description: description,
                                    offer_cost: offerCost,
                                    businessname: businessName,
                                    redeems: [],
                                    nodeid: nodeid
                                };
                                var params = {
                                    uri: url,
                                    body: JSON.stringify(doc)
                                };
                                //Resolve promise and pass through params
                                resolve(params)
                            }
                        }).then(function(params) {
                            //Promise to put offer into CouchDB
                            return new Promise(function(resolve, reject) {
                                request.put(params, function(err, response, body) {
                                    if(err) {
                                        return next(new restify.InternalServerError('Cant create document in CouchDB'));
                                    }
                                    if(response) {
                                        resolve(response)
                                    }
                                })
                            }).then(function() {
                                //Set headers
                                res.setHeader('Location', 'http://' + req.headers.host + req.url);
                                res.setHeader('Last-Modified', date);
                                res.setHeader('Content-Type', 'application/json');
                                //Build body to send back
                                var sendBack = {
                                    Added: 'OK',
                                    Offer_Title: offertitle,
                                    Offer_Description: description,
                                    Date_Added: date
                                }
                                //Send offer that was created
                                res.send(201, sendBack);
                                res.end();
                            })
                        })
                    })
                }
            })
        },
        getAllOffers: function(req, res, next) {
            //Set business name
            var business = req.params.businessname;
            console.log('Getting' + business + 'offers');
            if(business == 'all') {
                var url = 'http://localhost:5984/offers/_design/offers/_view/all';
            } else {
                var url = 'http://localhost:5984/offers/_design/offers/_view/business?startkey="' + business + '"&endkey="' + business + '"';
            };
            //Create a promise for the get request
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) {
                        reject(err)
                    };
                    console.log('code ' + response.statusCode)
                    //If body is there then pass through response and body
                    if(body) {
                        resolve({
                            response: response,
                            body: body
                        })
                    }
                })
            }).
            catch(function(err) {
                console.log("GET request error on couchDB document")
                return next(new restify.InternalServerError('Error communicating with CouchDB'));
            }).then(function(doc) {
                //If no offer is found return error
                if(doc.response.statusCode === 404) {
                    return next(new restify.InternalServerError('No Offers Found'));
                } else if(doc.response.statusCode === 200) {
                    //If offer is there do the following
                    var resp = JSON.parse(doc.body);
                    console.log(resp.rows);
                    var allOffers = [];
                    //For each loop to put all the offers into an array to send
                    resp.rows.forEach(function(i) {
                        var offer = {
                            title: i.value.offer_title,
                            description: i.value.offer_description,
                            points_cost: i.value.offer_cost,
                            businessname: i.value.businessname,
                            last_modified: i.value.last_modified
                        };
                        allOffers.push(offer);
                    });
                    //Create the object of what will be sent back
                    var offers = {
                        total_Offers: resp.rows.length,
                        offers: allOffers
                    };
                    //Time and date for header
                    var d = new Date();
                    var date = d.toUTCString();
                    //Set headers and send offers
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accepts', 'GET');
                    res.send(offers);
                    res.end()
                }
            })
        },
        redeemOffer: function(req, res, next) {
            console.log('REDEEM OFFER!');
            //Set username from auth header
            var username = req.authorization.basic.username;
            var password = req.authorization.basic.password;
            //Get offerTitle from params
            var offerTitle = req.params.offerTitle;
            var offerUrl = 'http://localhost:5984/offers/' + offerTitle;
            var userUrl = 'http://localhost:5984/users/' + username;
            //Create the offer variables which are used in promises
            var offer, cost, businessName, totalPoints, user;
            var credentials = true;
            //Build the transaction variables
            var d = new Date(),
                date = d.toUTCString(),
                txID = uuid.v1();
            //Check to make sure offer title has been sent in the body params
            if(typeof offerTitle == 'undefined') {
                return next(new restify.NotAcceptableError('Please supply an offer title'));
            };
            //Make sure the user has priveledges to redeem from header credentials
            //Check username and password is correct
            pwdCheck.check(username, password, 'user').
            catch(function(err) {
                credentials = false;
                return next(new restify.UnauthorizedError('Invalid username/password'));
            }).then(function() {
                //Only do the following if credentials still set to true
                if(credentials === true) {
                    //Get the offer URL
                    //Create a promise for the get request
                    return new Promise(function(resolve, reject) {
                        request.get(offerUrl, function(err, response, body) {
                            if(err) {
                                reject(err)
                            };
                            // if the document isnt found it will create it from sratch
                            console.log('code ' + response.statusCode)
                            if(body) {
                                resolve({
                                    response: response,
                                    body: body
                                })
                            }
                        })
                    }).
                    catch(function(err) {
                        console.log("GET request error on couchDB document")
                        return next(new restify.InternalServerError('Error communicating with CouchDB'));
                    }).then(function(call) {
                        //If offer not found
                        if(call.response.statusCode === 404) {
                            return next(new restify.NotFoundError('Offer Not Found'));
                        };
                        //If offer is found do the following
                        if(call.response.statusCode === 200) {
                            //Set offer variable as whats returned from the GET Offer
                            offer = JSON.parse(call.body);
                            //Take some values from the offer
                            businessName = offer.businessname;
                            cost = offer.offer_cost;
                            //Promise to get user doc
                            return new Promise(function(resolve, reject) {
                                request.get(userUrl, function(err, response, userdoc) {
                                    //If no user exists
                                    if(response.statusCode === 404) {
                                        return next(new restify.NotFoundError('User Not Found'));
                                        reject(err)
                                    };
                                    if(response.statusCode === 200) {
                                        user = JSON.parse(userdoc);
                                        console.log('user points' + user.points)
                                        //Check to see if user has enough points to redeem
                                        if((user.points - cost) < 0) {
                                            console.log("You don't have enough points sunshine - come back another day :D")
                                            return next(new restify.ForbiddenError("You don't have enough points to redeem this offer"));
                                        }
                                        resolve()
                                    }
                                })
                            }).then(function() {
                                //Promise to add transaction to user document
                                return new Promise(function(resolve, reject) {
                                    //Change points to reflect redemption
                                    user.points = user.points - cost;
                                    totalPoints = user.points;
                                    //Add tranasaction to array
                                    user.transactions.push({
                                        transactionid: txID,
                                        date: date,
                                        offer: offerTitle,
                                        amount_of_points: (cost - (cost * 2)),
                                        business_redeemed: businessName
                                    });
                                    console.log(username + " now has " + totalPoints + " points");
                                    //Build the object for sending to couchDB
                                    var userParams = {
                                        uri: userUrl,
                                        body: JSON.stringify(user)
                                    };
                                    //Update user document with new points total and added transaction
                                    request.put(userParams, function(err, response, body) {
                                        if(err) {
                                            return next(new restify.InternalServerError('Cant Update CouchDB document'));
                                            reject(err)
                                        };
                                        //Add offer to tranasctions array
                                        offer.redeems.push({
                                            transactionid: txID,
                                            date: date,
                                            amount_of_points: (cost - (cost * 2)),
                                            user_redeemed: username
                                        });
                                        //Build params
                                        var redeemParams = {
                                            uri: offerUrl,
                                            body: JSON.stringify(offer)
                                        };
                                        resolve(redeemParams);
                                    })
                                }).then(function(redeem) {
                                    //Put offer back to couchDB with redeem added
                                    request.put(redeem, function(err, response, body) {
                                        if(err) {
                                            return next(new restify.InternalServerError('Cant Update CouchDB document'));
                                            reject(err)
                                        }
                                        //Set headers
                                        res.setHeader('Last-Modified', date);
                                        res.setHeader('Content-Type', 'application/json');
                                        res.setHeader('Accepts', 'PUT');
                                        //Build object to send back on successful redeem
                                        var sendBack = {
                                            Redeem: 'OK',
                                            username: username,
                                            business: businessName,
                                            points_taken: cost,
                                            total_points: totalPoints
                                        }
                                        //Send back redeem details
                                        res.send(202, sendBack);
                                        res.end();
                                    })
                                })
                            })
                        }
                    })
                }
            })
        }
    }
})();