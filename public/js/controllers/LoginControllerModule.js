angular.module('LoginControllerModule',[]).controller('LoginController',function($scope,$location,loginService,$window,$state,$rootScope){
    console.log("logincontroller");

    $rootScope.authenticated=false;

    $rootScope.isAuthenticated= function(){
        return $rootScope.authenticated;
    };

    $scope.login = function(){
        var email = $scope.email;
        var password = $scope.password;

        loginService.loginUser(email,password).then(function(datafromserver){
            var result=datafromserver.data;
            //console.log("session"+ result);

            if(result.state=="failure"){
                $scope.message=result.message;
                $rootScope.authenticated=false;
            }else{
                $scope.message="logged in";
                $rootScope.authenticated=true;
                //$location.url('/home/welcome');
                //$window.location.reload();
                $rootScope.user=result.user;
                $state.go("home.welcome");
            }
        });
    }
});