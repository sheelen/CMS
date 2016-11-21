angular.module('ConfServiceNormalModule',[]).factory('ConfServiceNormal',['$http',function($http){
    return{
        ListConferenceNormal: function (x) {
            return $http.post("/conf/myconferences/normal",
                {
                    userId:x
                });
        }
    }
}]);
