angular.module('MyConfServiceModule',[]).factory('MyConfService',['$http',function($http){

    return {
        fetchConferenceData: function (id) {
            return $http.get("/conf/showconf/chair",{params: {confId:id}}
               );
        },
        getAuthors: function (id) {
            return $http.get("/editConf/getAuthors",{params:{confId:id}}
            );
        },

        addReviewer: function(confId,subId,reviewerId){
            return $http.post('/editConf/assignReviewer',
                {
                    confId:confId,
                    subId:subId,
                    reviewerId:reviewerId
                });
        },
        updateSubmissionDate: function(submissionDate,confId){
            return $http.post('/editConf/updateDate/submission',
                {subDate:submissionDate,
                confId:confId}
            );
        },
        updateReviewDate: function(reviewDate,confId){
            return $http.post('/editConf/updateDate/review',
                {revDate:reviewDate,
                    confId:confId}
            );
        },
        closeSubmission: function(confId){
            return $http.post('/editConf/close/submission',
                {
                    confId:confId
                }
            );
        },
        closeReview: function(confId){
            return $http.post('/editConf/close/review',
                {
                    confId:confId
                }
            );
        },
        withdrawSubmission: function(subId,userId){
            return $http.post('/editConf/submission/withdraw',
                {
                   subId:subId,
                    userId:userId
                }
            );
        },
        acceptSubmission: function(subId,userId){
            return $http.post('/editConf/submission/accept',
                {
                    subId:subId,
                    userId:userId
                }
            );
        },
        rejectSubmission: function(subId,userId){
            return $http.post('/editConf/submission/reject',
                {
                    subId:subId,
                    userId:userId
                }
            );
        }
    };
}]);