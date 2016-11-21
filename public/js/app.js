angular.module('cms', ['ui.router','xeditable','angularMoment','ui.bootstrap','btford.socket-io','ngRoute', 'appRoutes','LoginControllerModule','LoginServiceModule',
    'UserControllerModule','UserServiceModule','HomeControllerModule','HomeServiceModule','PreReqServiceModule','PreReqControllerModule',
    'editUserControllerModule','RemoveReqControllerModule','ConfControllerModule','ConfServiceModule','ConfControllerNormalUserModule',
    'ConfServiceNormalModule','MyConfServiceModule','MyConfControllerModule','SubmissionControllerModule','SubmissionServiceModule',
    'ReviewServiceModule','ReviewControllerModule','ChatControllerModule','ChatServiceModule','ChartControllerModule','ChartServiceModule'
]).run(function(editableOptions,$rootScope) {
    editableOptions.theme = 'bs3';
    $rootScope.value = {
        getId: function(row) {
            if(row!=null){
            return row._id}
        }
    }
});
