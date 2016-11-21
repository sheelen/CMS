angular.module('PreReqControllerModule',[]).controller('PreReqController',function($scope,$location,PreReqService,$state,$window,$rootScope){
    console.log("PreReqcontroller");


    PreReqService.getUserObject($rootScope.user._id).then(function(userObject){
            console.log(userObject);
            $scope.requestStatus=userObject.data.status;
        console.log($scope.requestStatus);
        if(userObject){
            $scope.adminComment=userObject.data.comment.adminComment;}
    });

    $scope.Submit = function(){
        var comments = $scope.comments;
        console.log(comments);
        var id=$rootScope.user._id;
        console.log(id);
        PreReqService.Submit(comments,id).then(function(message){
             if(message=="failure"){
             $scope.message1=message;
             }else{
             $scope.message1="Comment Posted";
                 $state.go($state.current, {}, {reload: true});
             }
        })
    };

    PreReqService.FetchNewReq().then(function(user){
        $scope.result=user.data;
       // console.log($scope.result);
    });


    $scope.Accept= function(id) {
        //Accept/Reject requests
        console.log('Accept request');
        //id=$rootScope.user._id;
        PreReqService.Accept(id._id).then(function () {
            $state.go($state.current, {}, {reload: true});
       })
    };

    $scope.Reject=function(x) {
        //var comments1 = $scope.comments1;
        var id = x._id;
        console.log('Reject request');
        PreReqService.Reject(x.comment.adminComment,id).then(function() {

            $state.go($state.current, {}, {reload: true});
        });
    };
});