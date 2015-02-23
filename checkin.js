function checkin(req, res, next) {
    // Get user and set couchdb url
    var user = req.query.user,
        points = parseInt(req.query.points),
        url = 'http://localhost:5984/users/' + user;
    console.log('CHECKIN ');
    console.log('PUT ' + user);
    console.log('Parameters supplied.');
    validateHTTP.validateHTTP(req, res, next)
    request.get(url, function(err, response, body) {
        console.log("Request started.")
        // if the document isnt found it will create it from sratch
        if(response.statusCode == 404) {
            return next(new restify.ForbiddenError('User Not Found'));
        };
        if(response.statusCode == 200) {
            console.log('Existing document.');
            body = JSON.parse(body);
            var pwd = sha1(req.authorization.basic.password + body.salt);
            if(pwd != body.password) {
                return next(new restify.ForbiddenError('Invalid username/password.'));
            }
            console.log('Passwords match!');
            var d = new Date(),
                date = d.toUTCString();
            // change what we need in the body e.g the points can probably add to the array aswell
            body.last_modified = date;
            body.points = body.points + points;
            // adding the transactions to the array so we can keep track of them
            body.transactions.push({
                transactionid: uuid.v1(),
                date: date,
                amount_of_points: points
            })
            console.log(body.points);
            var params = {
                uri: url,
                body: JSON.stringify(body)
            };
            request.put(params, function(err, response, body) {
                if(err) {
                    return next(new restify.InternalServerError('Cant create document'));
                }
                // document has been inserted into database
                res.setHeader('Location', 'http://' + req.headers.host + req.url);
                res.setHeader('Last-Modified', date);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Accepts', 'PUT');
                res.send("points added");
                res.end();
            });
        };
    });
};

exports.checkin = checkin;