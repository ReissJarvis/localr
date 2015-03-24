var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');
module.exports.redeemOffer = function(req, res, next) {
    console.log('REDEEM OFFER!');
    //Set username from auth header
    var username = req.authorization.basic.username;
    //Get offerTitle from params
    var offerTitle = req.params.offerTitle;
    var offerUrl = 'http://localhost:5984/offers/' + offerTitle;
    var userUrl = 'http://localhost:5984/users/' + username;
    //Check to make sure offer title has been sent in the body params
    if(typeof offerTitle == 'undefined') {
        return next(new restify.NotAcceptableError('Please supply an offer title'));
    };
    //Get the offer URL
    request.get(offerUrl, function(err, response, body) {
        //If offer not found
        if(response.statusCode === 404) {
            return next(new restify.NotFoundError('Offer Not Found'));
        };
        //If offer is found
        if(response.statusCode === 200) {
            //Set offer variable as whats returned from the GET Offer
            var offer = JSON.parse(body);
            //Take some values from the offer
            var businessName = offer.businessname;
            var  cost = offer.offer_cost;
            //Get the users document so we can add the transaction
            request.get(userUrl, function(err, response, doc) {
                //If no user exists
                if(response.statusCode === 404) {
                    return next(new restify.NotFoundError('User Not Found'));
                };
                //If user exists
                if(response.statusCode === 200) {
                    var user = JSON.parse(doc);
                    //Make sure user has enough points to redeem
                    if((user.points - cost) < 0) {
                        console.log("You don't have enough points sunshine - come back another day :D")
                        return next(new restify.ForbiddenError("You don't have enough points to redeem this offer"));
                    } else {
                        //Build the transaction to add to users transactions
                        var d = new Date(),
                            date = d.toUTCString(),
                            txID = uuid.v1();
                        //Get users transaction and points
                        user.points = user.points - cost;
                        var totalPoints = user.points;
                        user.transactions.push({
                            transactionid: txID,
                            date: date,
                            amount_of_points: (cost - (cost * 2)),
                            business_redeemed: businessName
                        })
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
                            }
                            offer.redeems.push({
                                transactionid: txID,
                                date: date,
                                amount_of_points: (cost - (cost * 2)),
                                user_redeemed: username
                            })
                            var redeemParams = {
                                uri: offerUrl,
                                body: JSON.stringify(offer)
                            };
                            request.put(redeemParams, function(err, response, body) {
                                if(err) {
                                    return next(new restify.InternalServerError('Cant Update CouchDB document'));
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
                    }
                }
            })
        }
    })
};
module.exports.addOffer = function(req, res, next) {
    //Data that has been sent in the request
    console.log('NEW OFFER!');
    //Connection to neo4j
    db = new neo4j('http://localhost:7474');
    var rand = uuid.v1()
    //Set variables from params
    var businessName = req.params.businessname;
    var description = req.params.description;
    var offertitle = req.params.title + ' - ' + businessName;
    var offerCost = req.params.cost;
    var nodeid = 0;
    //URL for when offer will be stored in CouchDB
    var url = 'http://localhost:5984/offers/' + offertitle;
    request.get(url, function(err, response, body) {
        if(err) {
            return next(new restify.InternalServerError('Error communicating with CouchDB'));
        }
        // if the document isnt found it will create it from sratch
        console.log('CouchDB request statuscode - ' + response.statusCode)
        if(response.statusCode === 200) {
            return next(new restify.ConflictError('Offer has already been created with the same name'));
        } else if(response.statusCode === 404) {
            //Insert node into neo4j
            db.insertNode({
                name: offertitle
            }, ['Offer', businessName], function(err, node) {
                if(err) throw err;
                // Output node properties.
                console.log('New neo4j node created with name = ' + node.name);
                // Output node id.
                console.log(node._id);
                nodeid = node._id
                var d = new Date(),
                    date = d.toUTCString();
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
                var docStr = JSON.stringify(doc);
                var params = {
                    uri: url,
                    body: docStr
                };
                request.put(params, function(err, response, body) {
                    if(err) {
                        return next(new restify.InternalServerError('Cant create document in CouchDB'));
                    }
                    // document has been inserted into database
                    res.setHeader('Location', 'http://' + req.headers.host + req.url);
                    res.setHeader('Last-Modified', date);
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode(201)
                    var sendBack = {
                        Added: 'OK',
                        Offer_Title: offertitle,
                        Offer_Description: description,
                        Date_Added: date
                    }
                    res.send(sendBack);
                    res.end();
                });
            });
        };
    });
};
module.exports.getAllOffers = function(req, res, next) {
    console.log('Get All OFFERS!');
    //Gets all offers from couchDB as JSON
    var business = req.params.businessname;
    if(business == 'all') {
        var url = 'http://localhost:5984/offers/_design/offers/_view/all';
    } else {
        var url = 'http://localhost:5984/offers/_design/offers/_view/business?startkey="' + business + '"&endkey="' + business + '"';
    }
    request.get(url, function(err, response, body) {
        if(err) {
            return next(new restify.InternalServerError('Error communicating with CouchDB'));
        }
        if(response.statusCode === 200) {
            var resp = JSON.parse(body)
            var allOffers = [];
            resp.rows.forEach(function(i) {
                var offer = {
                    title: i.value.offer_title,
                    description: i.value.offer_description,
                    points_cost: i.value.offer_cost,
                    businessname: i.value.businessname,
                    last_modified: i.value.last_modified
                };
                console.log(offer)
                allOffers.push(offer);
            });
            var offers = {
                total_Offers: resp.rows.length,
                offers: allOffers
            }
            res.send(offers);
        } else if(response.statusCode === 404) {
            return next(new restify.InternalServerError('No Offers Found'));
        };
    });
};