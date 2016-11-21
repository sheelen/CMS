angular.module('LoginServiceModule',[]).factory('loginService',['$http',function($http){
    console.log("loginservice");

    return {
        loginUser : function(email,password){
            return $http.post("/users/login",
                {
                    username: email,
                    password: password
                });
        },
        checkLogin : function() {
            return $http.get('/users/loggedin');
        }
    }

}]);