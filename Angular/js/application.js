var myApp = angular.module("myApp", ['ngRoute']);
myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/mainpage', {
            templateUrl: 'templates/mainpage.html'
        }).when('/login', {
            templateUrl: 'templates/login.html'
        }).when('/signup', {
            templateUrl: 'templates/signup.html'
        }).when('/logout', {
            templateUrl: 'templates/logout.html'
        }).when('/search', {
            templateUrl: 'templates/search.html'
        }).otherwise({
            redirectTo: '/login'
        })
    }
])

myApp.controller('mainController', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.username = ""
        this.data = ""
        this.setLogin = function() {
            if(UserService.get().isLoggedIn) {
                this.data = {
                    string: "You're Signed In As: " + UserService.get().username + " ",
                    loginstate: "Logout",
                    href: 'logout'
                }
            } else {
                this.data = {
                    string: "You're Not Signed In",
                    loginstate: "Login",
                    href: 'login'
                }
            }
        }
    }
]);
myApp.controller('logout', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.logout = function() {
            UserService.reset();
            $location.path('/login');
            $location.replace;
        }
        this.logout();
    }
]);

myApp.factory('UserService', [
    function() {
        var status = {
            isLoggedIn: false,
            username: '',
            password: ''
        }
        return {
            get: function() {
                return status
            },
            set: function(aUsername, aPassword) {
                status.username = aUsername;
                status.password = aPassword;
                status.isLoggedIn = true;
                return status;
            },
            reset: function() {
                console.log('user service reset ');
                status = {
                    isLoggedIn: false,
                    username: '',
                    password: ''
                }
                return status;
            }
        };
    }
])

function auth_hash(username, password) {
    return 'Basic ' + btoa(username + ':' + password);
}