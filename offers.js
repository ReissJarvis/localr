var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');
module.exports.addOffer = function(req, res, next) {
    if((validateHTTP.validateHTTP(req, res, next, "business")) === true) {
        console.log('NEW OFFER!');
        console.log('PUT: ' + req.params.offer)
        db = new neo4j('http://localhost:7474');
        var rand = uuid.v1()
        var businessName = req.params.businessname
        var offertitle = req.params.offer + ' - ' + businessName
        var nodeid = 0;
        var url = 'http://localhost:5984/offers/' + offertitle;
        var description = req.params.description
        var REQ = req
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            // if the document isnt found it will create it from sratch
            console.log('code' + response.statusCode)
            if(response.statusCode === 200) {
                return next(new restify.ConflictError('Offer already created'));
            } else if(response.statusCode === 404) {
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
                    console.log(date);
                    console.log('Just above doc node id  ' + nodeid);
                    var doc = {
                        date_created: date,
                        last_modified: date,
                        uuid: rand,
                        offer_title: REQ.params.offer,
                        offer_description: description,
                        businessname: businessName,
                        redeems: [],
                        nodeid: nodeid
                    };
                    console.log('underneath node.id  ' + doc.nodeid);
                    var docStr = JSON.stringify(doc);
                    var params = {
                        uri: url,
                        body: JSON.stringify(doc)
                    };
                    request.put(params, function(err, response, body) {
                        if(err) {
                            return next(new restify.InternalServerError('Cant create document'));
                        }
                        // document has been inserted into database
                        body = JSON.parse(body);
                        res.send({
                            offer: req.params
                        });
                        res.end();
                    });
                });
            };
        });
        // if the document is found, that means the user is already created.
    };
};
module.exports.getAllOffers = function(req, res, next) {
    if((validateHTTP.validateHTTP(req, res, next, "users")) === true) {
        console.log('Get All OFFERS!');
        //Gets all offers from couchDB as JSON
        var url = 'http://localhost:5984/offers/_design/offers/_view/all';
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            if(response.statusCode === 200) {
                res.send(JSON.parse(response.body));
            }
            else if(response.statusCode === 404) {
                return next(new restify.InternalServerError('No Offers Found'));
            };
        });
    };
};
module.exports.getBusinessOffers = function(req, res, next) {
    if((validateHTTP.validateHTTP(req, res, next, "users")) === true) {
        var business = req.params.businessname;
        console.log('Get All OFFERS from' + business);
        //Gets all offers from couchDB as JSON
        var url = 'http://localhost:5984/offers/_design/offers/_view/business?startkey="' + business + '"&endkey="' + business + '"';
        request.get(url, function(err, response, body) {
            if(err) {
                return next(new restify.InternalServerError('Error has occured'));
            }
            if(response.statusCode === 200) {
                res.send(JSON.parse(response.body));
            }
            else if(response.statusCode === 404) {
                return next(new restify.InternalServerError('No Offers Found'));
            };
        });
    };
};