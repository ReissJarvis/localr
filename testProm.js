var Promise = require('promise'),
    request = require('request');
 
var test = new Promise(function (resolve, reject) {
  request.get('http://www.google.com', function (err, res, body) {
    if (err) reject(err);
    else resolve(body);
  });
})
test.then(function(body){
    console.log(body)
});


console.log('This will happen first')


