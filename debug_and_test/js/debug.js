localr = (function() {
    'use strict'
    var credentials = "",
        name = "",
        password = "",
        httpRequest = "";
    return {
        getDetails: function(flag) {
            if(flag == "user") {
                localr.setCred();
                var url = 'http://178.62.31.30:8080/users?username=' + name;
                if(window.XMLHttpRequest) { // mozilla, safari,...
                    httpRequest = new XMLHttpRequest();
                } else if(window.ActiveXObject) {
                    httpRequest = ("Microsoft.XMLHTTP");
                }
                httpRequest.open('GET', url);
                httpRequest.setRequestHeader('Authorization', credentials);
                httpRequest.setRequestHeader('Content-Type', "application/json");
                httpRequest.onload = function() {
                    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                        var response = JSON.parse(httpRequest.responseText);
                        console.log('In the get req');
                        console.log(response);
                    } else {
                        console.log(httpRequest.statusText);
                    }
                };
                httpRequest.send();
            } else if(flag == "business") {
                localr.setCred();
                var url = 'http://178.62.31.30:8080/business?businessname=' + name;
                if(window.XMLHttpRequest) { // mozilla, safari,...
                    httpRequest = new XMLHttpRequest();
                } else if(window.ActiveXObject) {
                    httpRequest = ("Microsoft.XMLHTTP");
                }
                httpRequest.open('GET', url);
                httpRequest.setRequestHeader('Authorization', credentials);
                httpRequest.setRequestHeader('Content-Type', "application/json");
                httpRequest.onload = function() {
                    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                        var response = JSON.parse(httpRequest.responseText);
                        console.log('In the get req');
                        console.log(response);
                    } else {
                        console.log(httpRequest.statusText);
                    }
                };
                httpRequest.send();
            } else {
                console.log("Error, Invalid Flag!");
            };
        },
        register: function(flag) {
            if(flag == "user") {
                localr.setCred();
                var url = 'http://178.62.31.30:8080/register?username=' + name;
                if(window.XMLHttpRequest) { // mozilla, safari,...
                    httpRequest = new XMLHttpRequest();
                } else if(window.ActiveXObject) {
                    httpRequest = ("Microsoft.XMLHTTP");
                }
                httpRequest.open('PUT', url);
                httpRequest.setRequestHeader('Authorization', credentials);
                httpRequest.setRequestHeader('content-type', "application/json");
                httpRequest.onload = function() {
                    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                        var response = JSON.parse(httpRequest.responseText);
                        console.log(response);
                    } else {
                        console.log(httpRequest.statusText);
                    }
                };
                httpRequest.send();
            } else if(flag == "business") {
                localr.setCred();
                var url = 'http://178.62.31.30:8080/register?businessname=' + name;
                if(window.XMLHttpRequest) { // mozilla, safari,...
                    httpRequest = new XMLHttpRequest();
                } else if(window.ActiveXObject) {
                    httpRequest = ("Microsoft.XMLHTTP");
                }
                httpRequest.open('PUT', url);
                httpRequest.setRequestHeader('Authorization', credentials);
                httpRequest.setRequestHeader('content-type', "application/json");
                httpRequest.onload = function() {
                    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                        var response = JSON.parse(httpRequest.responseText);
                        console.log(response);
                    } else {
                        console.log(httpRequest.statusText);
                    }
                };
                httpRequest.send();
            } else {
                console.log("Error, Invalid Flag!");
            };
        },
        setCred: function() {
            name = document.getElementById("username").value;
            console.log(name);
            password = document.getElementById("password").value;
            console.log(password);
            localr.getBasic();
        },
        getBasic: function() {
            credentials = "Basic " + btoa(name + ":" + password);
            console.log(credentials);
        },
        checkin: function() {
            var points = document.getElementById("points").value
            var url = 'http://178.62.31.30:8080/checkin?username=' + name + '&points=' + points;
            if(window.XMLHttpRequest) { // mozilla, safari,...
                httpRequest = new XMLHttpRequest();
            } else if(window.ActiveXObject) {
                httpRequest = ("Microsoft.XMLHTTP");
            }
            httpRequest.open('PUT', url);
            httpRequest.setRequestHeader('Authorization', credentials);
            httpRequest.setRequestHeader('content-type', "application/json");
            httpRequest.onload = function() {
                if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                    var response = JSON.parse(httpRequest.responseText);
                    console.log(response)
                } else {
                    console.log(httpRequest.statusText);
                }
            };
            httpRequest.send();
        }
    }
})()