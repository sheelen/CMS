angular.module('ConfControllerNormalUserModule',[]).controller('ConfControllerNormalUser',function($scope,ConfServiceNormal,$location,$state,$rootScope) {
    var x= $rootScope.user._id;
    ConfServiceNormal.ListConferenceNormal(x).then(function(conf){
        $scope.conferenceData=conf.data;
       });

    $scope.getStatus=function(data){
        var date = new Date();
        var presentDate = date.toJSON();
        if(presentDate<data.submissionEndDate){$scope.Status="Submission Stage";  return $scope.Status;}
        else if(presentDate>data.submissionEndDate && presentDate<data.reviewEndDate){$scope.Status="Review Stage";return $scope.Status;}
        else if(presentDate>data.reviewEndDate){$scope.Status="Ended";return $scope.Status;}
    };


});
