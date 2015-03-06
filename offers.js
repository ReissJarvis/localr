var validateHTTP = require("./validateHTTP.js");
var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid'),
    neo4j = require('node-neo4j');

module.exports.addOffer = function(req, res, next) {
    //Data that has been sent in the request
    console.log('NEW OFFER!');
    //Connection to neo4j
    db = new neo4j('http://localhost:7474');
    var rand = uuid.v1()
    var businessName = req.params.businessname
    var description = req.params.description
    var offertitle = req.params.title + ' - ' + businessName
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
                    // now send url and document back to user
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
    if(business) {
        var url = 'http://localhost:5984/offers/_design/offers/_view/business?startkey="' + business + '"&endkey="' + business + '"';
    } else {
        var url = 'http://localhost:5984/offers/_design/offers/_view/all';
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