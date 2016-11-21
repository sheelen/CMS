angular.module('HomeControllerModule',[]).controller('HomeController',function($scope,$location,homeService,$state,$rootScope){
    console.log("homecontroller");

    $rootScope.isRole= function(role){

        if(role==$rootScope.user.privilege){
            return true;
        }else{
            return false;
        }
    };
    $scope.logout= function(){
        homeService.logout().then(function(){
            $rootScope.authenticated=false;
            $state.go('/');
        });
    }

});