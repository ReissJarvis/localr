var checkin = require('./checkin.js'),
    getDetails = require('./getDetails.js'),
    offer = require('./offers.js'),
    register = require('./register.js'),
    del = require('./del.js'),
    groups = require('./groups.js'),
    update = require('./update.js');
    

exports.getRoutes = function(server){
    var users = "/users",
        business = "/business",
        offers = '/offers',
        group = '/groups';
 
   // The way this works by sending a parameter of "business" and looks up how many points to add from couchDB
    server.get({
        path: users + "/test"
    }, function(req, res,next) {
        res.send('works')
        res.end();
    });
    // The way this works by sending a parameter of "business" and looks up how many points to add from couchDB
    server.put({
        path: users + "/checkin"
    }, function(req, res, next) {
        checkin.checkin(req, res, next);
    });
    // Get details for user
    server.get({
        path: users + "/get/:username"
    }, function(req, res, next) {
        getDetails.getDetails(req, res, next, 'users');
    });
    // Get details for business
    server.get({
        path: business + "/get/:businessname"
    }, function(req, res, next) {
        getDetails.getDetails(req, res, next, 'business');
    });
    //Register user
    server.post({
        path: users
    }, function(req, res, next) {
        if(req.authorization.scheme !== 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
            failed = true;
        } else {
            register.register(req, res, next, 'users');
        }
    });
    // Register business.
    server.post({
        path: business
    }, function(req, res, next) {
        if(req.authorization.scheme !== 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
            failed = true;
        } else {
            register.register(req, res, next, 'business');
        }
    });
    //Update User
    server.put({
        path: users + "/update"
    }, function(req, res, next) {
        if(req.authorization.scheme !== 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
            failed = true;
        } else {
            update.update(req, res, next, 'users');
        }
    });
    //Update Business
    server.put({
        path: business + "/update"
    }, function(req, res, next) {
        if(req.authorization.scheme !== 'Basic') {
            return next(new restify.UnauthorizedError('Basic HTTP auth required'));
            failed = true;
        } else {
            update.update(req, res, next, 'business');
        }
    });
    // Delete user
    server.del({
        path: users
    }, function(req, res, next) {
        del.del(req, res, next, 'users');
    });
    // Delete business
    server.del({
        path: business
    }, function(req, res, next) {
        del.del(req, res, next, 'business');
    });
    server.post({
        path: group
    }, function(req, res, next) {
        groups.groups.createGroup(req, res, next);
    });
    //?username=username&groupname=test21
    server.get({
        path: group +"/:groupname"
    }, function(req, res, next) {
        groups.showgroup(req, res, next);
    });
    //?username=username&competition=freshers
    server.get({
        path: group
    }, function(req, res, next) {

        groups.showcompetitiongroup(req, res, next);
    });
    //?username=username&groupname=test21
    server.put({
        path: users + "/joingroup"
    }, function(req, res, next) {
        groups.joinGroup(req, res, next);
    });
    //Create Offer
    server.post({
        path: business + offers
    }, function(req, res, next) {
        offer.addOffer(req, res, next);
    });
    //Get all Offers
    server.get({
        path: business + offers + '/:businessname'
    }, function(req, res, next) {
        offer.getAllOffers(req, res, next);
    });
    //Redeem Offer
    server.put({
        path: business + offers + '/redeem'
    }, function(req, res, next) {
        offer.redeemOffer(req, res, next);
    }); 
 }
