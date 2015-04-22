myApp.controller('signup', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        var that = this;
        this.data = {
            city: "",
            dob: "",
            firstname: "",
            surname: "",
            email: ""
        }
        this.signup = function() {
            $http({
                url: '' + USERNAME,
                method: 'POST',
                headers: {
                    'authorization': auth_hash('PUT USERNAME AND PASS HERE')
                },
                data: that.data
            }).success(function(data, status, headers, config) {
                $location.path('/mainpage');
                $location.replace;
            })
        }
    }
]);