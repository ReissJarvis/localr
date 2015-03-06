describe('Localr API', function() {
    var request = require('request');
    describe('Users', function() {
        describe('create the user', function(done) {
            it("be able to create a user", function(done) {
                  
                var url = 'http://api.adam-holt.co.uk/users/testuser';
                var doc = {
                            name:"testuser"
                        };
                var params = {
                            uri: url,
                            body: JSON.stringify(doc)
                        };
                request.post(params, function(error, response, body) {
                    expect(response.statusCode).toBe(201);
                    expect(response.body).toBe(true);
                })
            })
        })
    })
    describe('checkin', function() {
        it("be able to checkin", function() {})
        it("check points have been added", function() {})
    })
    it("be able to see where you've checked in", function() {})
    it("be able delete yourself", function() {})
});
it("be able to create a group", function() {})
it("be able to delete a group", function() {})
it("be able to join a group", function() {})
it("Be able to get the latest offers", function() {})
it("be able to redeem the latest offer", function() {})
it("be able to check what offers youve redeemed", function() {})
});
getBasic = function(username, password) {
    return "Basic " + btoa(username + ":" + password);
}
//  getDetails: function(type) {
//             if(type == "users") {
//                 localr.setCred("users");
//                 var url = 'http://api.adam-holt.co.uk/users/get?username=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('GET', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('Content-Type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log('In the get req');
//                         console.log(response);
//                     } else {
//                         console.log(httpRequest.statusText);
//                     }
//                 };
//                 httpRequest.send();
//             } else if(type == "business") {
//                 localr.setCred("business");
//                 var url = 'http://api.adam-holt.co.uk/business/get?businessname=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('GET', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('Content-Type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log('In the get req');
//                         console.log(response);
//                     } else {
//                         console.log(httpRequest.statusText);
//                     }
//                 };
//                 httpRequest.send();
//             } else {
//                 console.log("Error, Invalid Type!");
//             };
//         },
//         register: function(type) {
//             if(type == "users") {
//                 localr.setCred("users");
//                 var url = 'http://api.adam-holt.co.uk/users/register?username=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('PUT', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('content-type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log(response);
//                         return response, httpRequest;
//                     } else {
//                         console.log(httpRequest.statusText);
//                         return httpRequest;
//                     }
//                 };
//                 httpRequest.send();
//             } else if(type == "business") {
//                 localr.setCred("business");
//                 var url = 'http://api.adam-holt.co.uk/business/register?businessname=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('PUT', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('content-type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log(response);
//                         return response
//                     } else {
//                         console.log(httpRequest.statusText);
//                         return httpRequest.statusText
//                     }
//                 };
//                 httpRequest.send();
//             } else {
//                 console.log("Error, Invalid Type!");
//             };
//         },
//         setCred: function(type) {
//             if(type == "users") {
//                 name = document.getElementById("username").value
//                 console.log(name);
//                 password = document.getElementById("userpassword").value
//                 console.log(password);
//                 localr.getBasic();
//             } else if(type == "business") {
//                 name = document.getElementById("businessname").value;
//                 console.log(name);
//                 password = document.getElementById("businesspassword").value;
//                 console.log(password);
//                 localr.getBasic();
//             } else {
//                 console.log("Error, Invalid Type!");
//             };
//         },
//         getBasic: function() {
//             credentials = "Basic " + btoa(name + ":" + password);
//             console.log(credentials);
//         },
//         checkin: function() {
//             var points = document.getElementById("points").value
//             var url = 'http://api.adam-holt.co.uk/users/checkin?username=' + name + '&points=' + points;
//             if(window.XMLHttpRequest) { // mozilla, safari,...
//                 httpRequest = new XMLHttpRequest();
//             } else if(window.ActiveXObject) {
//                 httpRequest = ("Microsoft.XMLHTTP");
//             }
//             httpRequest.open('PUT', url);
//             httpRequest.setRequestHeader('Authorization', credentials);
//             httpRequest.setRequestHeader('content-type', "application/json");
//             httpRequest.onload = function() {
//                 if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                     var response = JSON.parse(httpRequest.responseText);
//                     console.log(response)
//                     return response
//                 } else {
//                     console.log(httpRequest.statusText);
//                     return httpRequest.statusText
//                 }
//             };
//             httpRequest.send();
//         },
//         delete: function(type) {
//             if(type == "users") {
//                 localr.setCred("users");
//                 var url = 'http://api.adam-holt.co.uk/users/delete?username=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('DELETE', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('Content-Type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log('In the delete req');
//                         console.log(response);
//                     } else {
//                         console.log(httpRequest.statusText);
//                     }
//                 };
//                 httpRequest.send();
//             } else if(type == "business") {
//                 localr.setCred("business");
//                 var url = 'http://api.adam-holt.co.uk/business/delete?businessname=' + name;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('GET', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('Content-Type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log('In the get req');
//                         console.log(response);
//                     } else {
//                         console.log(httpRequest.statusText);
//                     }
//                 };
//                 httpRequest.send();
//             } else {
//                 console.log("Error, Invalid Type!");
//             }
//         },
//         addOffer: function(type) {
//             var offer = document.getElementById("offertitle").value;
//             var description = document.getElementById("offerdescription").value;
//             if(type == "business") {
//                 localr.setCred("business");
//                 var url = 'http://api.adam-holt.co.uk/business/offers/add?businessname=' + name + '&offer=' + offer + '&description=' + description;
//                 if(window.XMLHttpRequest) { // mozilla, safari,...
//                     httpRequest = new XMLHttpRequest();
//                 } else if(window.ActiveXObject) {
//                     httpRequest = ("Microsoft.XMLHTTP");
//                 }
//                 httpRequest.open('PUT', url);
//                 httpRequest.setRequestHeader('Authorization', credentials);
//                 httpRequest.setRequestHeader('content-type', "application/json");
//                 httpRequest.onload = function() {
//                     if(httpRequest.readyState === 4 && httpRequest.status === 200) {
//                         var response = JSON.parse(httpRequest.responseText);
//                         console.log(response);
//                     } else {
//                         console.log(httpRequest.statusText);
//                     }
//                 };
//                 httpRequest.send();
//             } else {
//                 console.log("Error, Invalid Type!");
//             };