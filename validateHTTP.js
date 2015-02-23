var restify = require('restify'),
    request = require('request'),
    rand = require('csprng'),
    sha1 = require('sha1'),
    uuid = require('node-uuid');

function validateHTTP(req, res, next) {
    // checks to see if the username is in the URL 
    if (req.params.user[0] != req.authorization.basic.username) {
        return next(new restify.ForbiddenError('You can\'t access that user'));
    }
    // checks it contains  content type application/json
    if (req.headers['content-type'] !== 'application/json') {
        return next(new restify.UnsupportedMediaTypeError('Bad Content-Type'));
    }
    // checks if it has basic authorization
    if (req.authorization.scheme !== 'Basic') {
        return next(new restify.UnauthorizedError('Basic HTTP auth required'));
    }
}

module.exports.validateHTTP = validateHTTP;