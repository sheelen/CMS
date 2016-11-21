angular.module('ChatServiceModule',[]).factory('ChatService',function($http,socketFactory,$rootScope){
console.log("Chat Service")
    
    var socket = socketFactory();

    socket.forward('message')
    return socket;
  /*  return {
        sendMessageToPeople : function (message,room){
    var socket = io.connect();
           
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
       socket.emit('room', room);
        socket.emit('message',message);

    });
            socket.on('message', function(data) {
                console.log("Data from server!!"+data);
                $rootScope.messageToBroadcast = data;
               // $scope.test= data;
                //console.log("Data from server....................!!"+$scope.test);
                return data;
            });

    } */



   // var socket = socketFactory();
   // socket.forward('broadcast');
   // return socket;
});