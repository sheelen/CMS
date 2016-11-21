angular.module('ConfServiceModule',[]).factory('ConfService',['$http',function($http){


    return {
        CreateConference: function (object) {
            return $http.post("/conf/createConf", object
            );
        },

        ListConferenceNormal: function () {
            return $http.get("/conf/allconferences/normal",
                {});

        },
        ListConferenceChair: function (id) {
            return $http.get("/conf/allconferences/chair",{params:{userId:id}}
            );

        },
        Join: function (userId, confId) {
            return $http.post("/conf/allconferences/join",
                {
                    userId: userId,
                    confId: confId
                });
        }
    }
}]);