myApp.controller('groups', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
this.getGroups= function(){
    
  $http({
                url: 'http://api.adam-holt.co.uk/groups?competition=freshers',
                headers: {
                    'authorization': auth_hash(UserService.get().username, UserService.get().password)
                },
                data: that.data
            }).success(function(data, status, headers, config) {
                $location.path('/mainpage');
                $location.replace;
            })
}
    }
]);