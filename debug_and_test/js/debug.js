localr = (function() {
    'use strict'
    var credentials = "",
        name = "",
        password = "",
        httpRequest = "";
    return {
        getDetails: function(type) {
            if(type == "users") {
                localr.setCred("users");
                var url = 'http://178.62.31.30:8080/users/get?username=' + name;
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
            } else if(type == "business") {
                localr.setCred("business");
                var url = 'http://178.62.31.30:8080/business/get?businessname=' + name;
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
                console.log("Error, Invalid Type!");
            };
        },
        register: function(type) {
            if(type == "users") {
                localr.setCred("users");
                var url = 'http://178.62.31.30:8080/users/register?username=' + name;
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
            } else if(type == "business") {
                localr.setCred("business");
                var url = 'http://178.62.31.30:8080/business/register?businessname=' + name;
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
                console.log("Error, Invalid Type!");
            };
        },
        setCred: function(type) {
            if(type == "users") {
                name = document.getElementById("username").value;
                console.log(name);
                password = document.getElementById("userpassword").value;
                console.log(password);
                localr.getBasic();
            } else if(type == "business") {
                name = document.getElementById("businessname").value;
                console.log(name);
                password = document.getElementById("businesspassword").value;
                console.log(password);
                localr.getBasic();
            } else {
                console.log("Error, Invalid Type!");
            };
        },
        getBasic: function() {
            credentials = "Basic " + btoa(name + ":" + password);
            console.log(credentials);
        },
        checkin: function() {
            var points = document.getElementById("points").value
            var url = 'http://178.62.31.30:8080/users/checkin?username=' + name + '&points=' + points;
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
        },
        delete: function(type) {
            if(type == "users") {
                localr.setCred("users");
                var url = 'http://178.62.31.30:8080/users/delete?username=' + name;
                if(window.XMLHttpRequest) { // mozilla, safari,...
                    httpRequest = new XMLHttpRequest();
                } else if(window.ActiveXObject) {
                    httpRequest = ("Microsoft.XMLHTTP");
                }
                httpRequest.open('DELETE', url);
                httpRequest.setRequestHeader('Authorization', credentials);
                httpRequest.setRequestHeader('Content-Type', "application/json");
                httpRequest.onload = function() {
                    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
                        var response = JSON.parse(httpRequest.responseText);
                        console.log('In the delete req');
                        console.log(response);
                    } else {
                        console.log(httpRequest.statusText);
                    }
                };
                httpRequest.send();
            } else if(type == "business") {
                localr.setCred("business");
                var url = 'http://178.62.31.30:8080/business/delete?businessname=' + name;
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
                console.log("Error, Invalid Type!");
            }
        }
    }
})()