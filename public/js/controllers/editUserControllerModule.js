angular.module('editUserControllerModule',[]).controller('editUserController',function($scope,$location,$state,$rootScope,userService){
    console.log("EditUserController");
    $scope.user;
    $scope.newPassword="";
    $scope.confirmPassword="";
    $scope.message="";
    $scope.successMessage="";
    $scope.currentPassword="";
    //$scope.id=$rootScope.user._id;
    userService.getUserInfoByEmailid($rootScope.user._id).then(function(userData){
        data=userData.data;
        console.log(data);
        $scope.user=data;
    });

    $scope.savePassword=function(){
        if($scope.newPassword==$scope.confirmPassword){

            userService.updatePassword($rootScope.user._id,$scope.currentPassword,$scope.newPassword).then(function(data){
                console.log(data);
                if(data.data.message=="1"){
                    $scope.confirmPassword="";
                    $scope.currentPassword="";
                    $scope.newPassword="";
                    $scope.successMessage="Password changed successfully";
                    $scope.message="";
                }
                if(data.data.message=="2"){
                    $scope.confirmPassword="";
                    $scope.currentPassword="";
                    $scope.newPassword="";
                    $scope.message="Invalid Password";
                    $scope.successMessage="";
                }
            });
        }
        else{
            $scope.message="**New, Re-typed passwords must be same**";
            $scope.confirmPassword="";
        }
    };

    $scope.saveUserInfo = function () {
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;
        var institution = $scope.user.institution;
        var city = $scope.user.city;
        var state = $scope.user.state;
        var country = $scope.user.country;
        var id = $scope.user._id;
        userService.saveUserInfo(id,firstName,lastName,institution,city,state,country).then(function (dataFrmServer){
            console.log(dataFrmServer);
            $scope.user=dataFrmServer.data;

            $state.go($state.current, {}, {reload: true});
        });
    };

});