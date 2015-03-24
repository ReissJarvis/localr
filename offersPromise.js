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
            var d = new Date();
            var date = d.toUTCString();
            //URL for when offer will be stored in CouchDB
            var url = 'http://localhost:5984/offers/' + offertitle;
            getRequest(url).
            catch(function(err) {
                console.log("GET request error on couchDB document")
                return next(new restify.InternalServerError('Error communicating with CouchDB'));
            }).then(function(call) {
                // if the document isnt found it will create it from sratch
                console.log('CouchDB request statuscode - ' + call.response.statusCode)
                if(call.response.statusCode === 200) {
                    return next(new restify.ConflictError('Offer has already been created with the same name'));
                }
                return call
            }).then(function(call) {
                console.log(call)
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
                    return doc
                }
            }).then(function(doc) {
                console.log(doc)
                var params = {
                    uri: url,
                    body: JSON.stringify(doc)
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
            getRequest(url).
            catch(function(err) {
                console.log("GET request error on couchDB document")
                return next(new restify.InternalServerError('Error communicating with CouchDB'));
            }).then(function(call) {
                if(call.response.statusCode === 404) {
                    return next(new restify.InternalServerError('No Offers Found'));
                } else if(call.response.statusCode === 200) {
                    var resp = JSON.parse(call.body)
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
                    res.end()
                }
            })
        },
        redeemOffer: function(req, res, next) {},
        getRequest: function(url) {
            // set up initial get request. 
            return new Promise(function(resolve, reject) {
                request.get(url, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    console.log('code' + response.statusCode)
                    resolve({
                        response: response,
                        body: body
                    })
                })
            });
        },
        putRequest: function(params) {
            return new Promise(function(resolve, reject) {
                request.put(params, function(err, response, body) {
                    if(err) reject(err);
                    // if the document isnt found it will create it from sratch
                    console.log('code' + response.statusCode)
                    resolve({
                        response: response,
                        body: body
                    })
                })
            });
        },
        nodequery: function(query) {
            return new Promise(function(resolve, reject) {})
        }
    }
})();