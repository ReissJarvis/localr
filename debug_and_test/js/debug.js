localr = (function() {
    'use strict'
    var credentials = "",
        username = "",
        password = "",
        httpRequest="";
    return {
        getUser: function() {
            localr.setCred();
            var url = "http://178.62.31.30:8080/users/" + username
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
                    console.log(response)
                } else {
                    console.log(httpRequest.statusText);
                }
            };
            httpRequest.send();
        },
        Register: function() {
            localr.setCred();
            var url = "http://178.62.31.30:8080/register/" + username
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
        setCred: function() {
            username = document.getElementById("username").value;
            console.log(username);
            password = document.getElementById("password").value;
            console.log(password);
            localr.getBasic();
        },
        getBasic: function() {
            credentials = "Basic " + btoa(username + ":" + password);
            console.log(credentials)
        },
        checkin: function(){
            var url = 'http://178.62.31.30:8080/checkin?user=' + username;
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