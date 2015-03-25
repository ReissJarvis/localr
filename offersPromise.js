var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j'),
    Promise = require('promise');
module.exports.offers = (function() {
    //Some handy variables
    var rand = uuid.v1(),
        db = new neo4j('http://localhost:7474');
    return {
        addOffer: function(req, res, next) {
            console.log('NEW OFFER!');
            //Set variables from params
            var businessName = req.params.businessname;
            var description = req.params.description;
            var offertitle = req.params.title + ' - ' + businessName;
            var offerCost = req.params.cost;
            var nodeid = 0;
            //Build date and time
            var d = new Date();
            var date = d.toUTCString();
            //URL for when offer will be stored in CouchDB
            var url = 'http://localhost:5984/offers/' + offertitle;
            //Make a new promise by getting the URL
            return new Promise(function(resolve, reject) {
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
                        resolve(params)
                    }
                }).then(function(params) {
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
                        // document has been inserted into database
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
                        res.send(201, sendBack);
                        res.end();
                    })
                })
            })
        },
        getAllOffers: function(req, res, next) {
            //Set business name
            var business = req.params.businessname;
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
            }).then(function(doc) {
                if(doc.response.statusCode === 404) {
                    return next(new restify.InternalServerError('No Offers Found'));
                } else if(doc.response.statusCode === 200) {
                    var resp = JSON.parse(doc.body)
                    var allOffers = [];
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
                    var offers = {
                        total_Offers: resp.rows.length,
                        offers: allOffers
                    };
                    //Time and date for header
                    var d = new Date();
                    var date = d.toUTCString();
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
            //Get offerTitle from params
            var offerTitle = req.params.offerTitle;
            var offerUrl = 'http://localhost:5984/offers/' + offerTitle;
            var userUrl = 'http://localhost:5984/users/' + username;
            //Create the offer variables which are used in promises
            var offer, cost, businessName, totalPoints, user;
            //Build the transaction variables
            var d = new Date(),
                date = d.toUTCString(),
                txID = uuid.v1();
            //Check to make sure offer title has been sent in the body params
            if(typeof offerTitle == 'undefined') {
                return next(new restify.NotAcceptableError('Please supply an offer title'));
            };
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
                                offer.redeems.push({
                                    transactionid: txID,
                                    date: date,
                                    amount_of_points: (cost - (cost * 2)),
                                    user_redeemed: username
                                });
                                var redeemParams = {
                                    uri: offerUrl,
                                    body: JSON.stringify(offer)
                                };
                                resolve(redeemParams);
                            })
                        }).then(function(redeem) {
                            request.put(redeem, function(err, response, body) {
                                if(err) {
                                    return next(new restify.InternalServerError('Cant Update CouchDB document'));
                                    reject(err)
                                }
                                // document has been inserted into database
                                res.setHeader('Last-Modified', date);
                                res.setHeader('Content-Type', 'application/json');
                                res.setHeader('Accepts', 'PUT');
                                var sendBack = {
                                    Redeem: 'OK',
                                    username: username,
                                    business: businessName,
                                    points_taken: cost,
                                    total_points: totalPoints
                                }
                                res.send(202, sendBack);
                                res.end();
                            })
                        })
                    })
                }
            })
        }
    }
})();