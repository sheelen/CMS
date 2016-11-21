angular.module('PreReqServiceModule',[]).factory('PreReqService',['$http',function ($http) {

    console.log("PreReqService");

    return {

        Submit : function(comments,id){
            return $http.post("/priv/request",
                {
                    comments: comments,
                    userid  : id
                });

    },

        FetchNewReq: function() {
            return $http.get("/priv/new",
                {

                });
        },

        Accept: function(id){
            return $http.post("/priv/new",
            {
                userid : id
            });
        },

        Reject: function(comments,id){
            return $http.put("/priv/new",
            {
                comments: comments,
                userid : id
            });
        },

        Remove: function(id){
            return $http.put("/priv/remove",
                {
                    userid : id
                });
        },
        GetGranted: function() {
            return $http.get("/priv/remove",
                {

                });
        },
        getUserObject: function(id) {
            return $http.post("/priv/getUser",
                {
                    userId:id
                });
        }
    }
}]);
