angular.module('ReviewServiceModule',[]).factory('ReviewService',['$http',function ($http) {

    return {

        getDetails: function (confId, userId) {
            return $http.get("/review/getDetails", {params: {userId: userId, confId: confId}});
        },

        addReview: function(reviewData) {
            return $http.post("/review/addReview", {
                review: reviewData
            });

        },
        getReviewStatusByConferenceId : function (conferenceId,conferenceName) {
            return $http.post("/review/getReviewStatusByConferenceId",{
                conferenceId : conferenceId
            })
        }
    }
}]);
