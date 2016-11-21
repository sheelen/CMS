angular.module('appRoutes',['ui.router']).config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider,$urlRouterProvider,$locationProvider){
    console.log("approutes");
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('/', {
            url: "/",
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .state('register', {
            url: "/register",
            templateUrl: 'views/register.html',
            controller: 'UserController'
        })
        .state('home', {
            url: "/home",
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            abstract:true,
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.requestForPrivilege', {
            url: "/request",
            templateUrl: 'views/requestPrivilegeNormalUser.html',
            controller: 'PreReqController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.FetchNew', {
            url: "/new",
            templateUrl: 'views/tables.html',
            controller: 'PreReqController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.RemoveReq', {
            url: "/remove",
            templateUrl: 'views/managePrivilegeAdmin.html',
            controller: 'RemoveReqController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.listConferences', {
            url: "/allconferences",
            templateUrl: 'views/allConferencesNormalUser.html',
            controller: 'ConfController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.myConferences', {
            url: "/myconferences/chair",
            templateUrl: 'views/myConferencesChair.html',
            controller: 'ConfController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.myConfChair', {
            url: "/showconf/chair/:confId",
            templateUrl: 'views/conferenceChair.html',
            controller: 'MyConfController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.create_conf', {
            url: "/createconf",
            templateUrl: 'views/createConferenceChair.html',
            controller: 'ConfController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.normal', {
            url: "/myconferences/normal",
            templateUrl: 'views/myConferenceNormalUser.html',
            controller: 'ConfControllerNormalUser',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.editUser', {
            url: "/editUser",
            templateUrl: 'views/UserProfile.html',
            controller: 'editUserController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.submitdoc', {
            url: "/submission/:confId",
            templateUrl: 'views/submissionNormalUser.html',
            controller: 'SubmissionController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.chat', {
            url: "/chat",
            templateUrl: 'views/chat.html',
            controller: 'ChatController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.chart', {
            url: "/chart",
            templateUrl: 'views/chart.html',
            controller: 'ChartController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.reviewdoc', {
            url: "/review/:confId",
            templateUrl: 'views/reviewNormalUser.html',
            controller: 'ReviewController',
            resolve:{
                logincheck: checkLoggedin
            }
        })
        .state('home.welcome', {
            url: "/",
            templateUrl: 'views/welcome_nested.html'
        });
    //$locationProvider.html5Mode(true);
}]);

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    if(!$rootScope.user){
    var deferred = $q.defer();
        $http.get('/users/loggedin').success(function(user) {

            if (user !== '0') {
                //we got data from session object now evrything is guuuuttttt//
                console.log("authenticated");
                $rootScope.authenticated=true;
                $rootScope.user = user;
                deferred.resolve();
            } else { //User is not Authenticated
                console.log("not authenticated");
                $rootScope.authenticated=false;
                deferred.reject();
                $location.url('/login');
            }
        });
    return deferred.promise;
    }
};