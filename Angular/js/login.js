myApp.controller('Login', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.username = '';
        this.password = '';
        this.login = function() {
            UserService.set(this.username, this.password);
            console.log(UserService.get().username + UserService.get().password + UserService.get().isLoggedIn);
            var userpassword = this.password;
            var self = this;
            self.docs = {};
            $http({
                url: '',
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                }
            }).success(function(data, status, headers, config) {
                $location.path('/mainpage');
                $location.replace;
            }).error(function(data, status, headers, config, statusText) {
                console.log(headers);
                console.log(config);
                console.log(status);
                console.log(statusText)
            })
        };
        this.stop = function() {
            return false;
        };
    }
]);