angular.module('HomeServiceModule',[]).factory('homeService',['$http',function($http){
    console.log("homeservice");
    return {
        logout : function(){
            return $http.get("/users/signout");
        }
    }
}]);