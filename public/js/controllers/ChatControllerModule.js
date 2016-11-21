angular.module('ChatControllerModule',[]).controller('ChatController',function($scope,$location,$log,$state,$rootScope,ConfServiceNormal,ChatService){
    console.log("chatController");
    $scope.messageLog=" ";
    $scope.nameOfTheUser = $scope.user.firstName;
    ConfServiceNormal.ListConferenceNormal($scope.user._id).then(function(conf){
        $scope.conferenceData=conf.data;
        $scope.myConferenceList=$scope.conferenceData.myConference;
    });

    $('#myModal').on('show.bs.modal', function (e) {
        $scope.roomToJoin = $(e.relatedTarget).text();
        console.log($scope.roomToJoin);
        $("#messageLog").val(" ");
    });

   $('#myModal').on('hidden.bs.modal', function () {
       $("#messageLog").val(" ");
       
    });

    $scope.sendMessage = function() {

console.log("sendMessage")
            ChatService.emit('message',{'room':$scope.roomToJoin,'message': $scope.user.email+":"+ $scope.message});

        $scope.message = '';

        /*var messageToBeSend= $scope.user.email+"::"+$scope.message;
        var test=ChatService.sendMessageToPeople(messageToBeSend,$scope.roomToJoin);
        $scope.message = '';
        console.log(test); */
    };

   /* $scope.$on('$destroy', function (event) {
        socketio.getSocket().removeAllListeners();
    }); */
    $scope.$on('socket:message',function (event,data) {
        console.log($scope.messageLog);
        console.log(data.newRoom);
        console.log(data.oldRoom);
        console.log(data.changed);
        if(data.changed=="yes"){
            $scope.messageLog="";
        }
        $scope.messageLog=(new Date()).toDateString()+"-"+data.message+'\n'+$scope.messageLog;
        


    });


});