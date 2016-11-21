angular.module('MyConfControllerModule',[]).controller('MyConfController',function($scope,MyConfService,$location,$state,$rootScope,$stateParams){
    console.log("MyConfController");
    $scope.authors=[];
    $scope.reviewerId="";
    $scope.Status="";
    $scope.messageSubDate="";
    $scope.messageReviewDate="";
    $scope.users=[];
    $scope.formData = {email: {}};
    $scope.currentConferenceId = $stateParams.confId;
    console.log($scope.currentConferenceId);

    MyConfService.fetchConferenceData($scope.currentConferenceId).then(function(conf){
        $scope.bigData=conf.data;
        console.log($scope.bigData);
        $scope.setStatus();
        angular.forEach($scope.bigData,function(data1,index){
            angular.forEach(data1.conferenceSubmissions,function(data2,index){
                if(data2.submissionStatus=="complete"){
                    $scope.users.push(data2.submittedBy.email);
                }
            })
        });
    });

    $scope.setStatus = function(){
        angular.forEach($scope.bigData,function(type,index){
            $scope.reviewDate=type.reviewEndDate;
            $scope.submissionDate=type.submissionEndDate;
        });
        var date = new Date();
        var presentDate = date.toJSON();
        if(presentDate<$scope.submissionDate){$scope.Status="Submission Stage";}
        else if(presentDate>$scope.submissionDate && presentDate<$scope.reviewDate){$scope.Status="Review Stage";}
        else if(presentDate>$scope.reviewDate){$scope.Status="Ended";}
    };

    $scope.closeSubmission = function(){
        MyConfService.closeSubmission($scope.currentConferenceId).then(function(object){
            console.log("submission closed");
            $state.go($state.current, {}, {reload: true});
        })
    };
    $scope.closeReview = function(){
        console.log("hit");
        MyConfService.closeReview($scope.currentConferenceId).then(function(object){
            $state.go($state.current, {}, {reload: true});
        })
    };
    $scope.withdrawSubmission=function(subId,userId){
        MyConfService.withdrawSubmission(subId,userId).then(function(Object){
            $state.go($state.current, {}, {reload: true});
        })
    };
    $scope.acceptSubmission=function(subId,userId){
        MyConfService.acceptSubmission(subId,userId).then(function(Object){
            $state.go($state.current, {}, {reload: true});
        })
    };
    $scope.rejectSubmission=function(subId,userId){
         MyConfService.rejectSubmission(subId,userId).then(function(Object){
             console.log(Object);
             $state.go($state.current, {}, {reload: true});
         })
    };

    $scope.subDate = function(data) {
        var date = new Date();
        var presentDate = date.toJSON();
        if(data < presentDate){$scope.messageSubDate="Submission end date can not be set to past";}
        else if(data > $scope.reviewDate){$scope.messageSubDate="Submission end date must fall before review end date";}
        else if(data>presentDate && data<$scope.reviewDate) {
            $scope.messageSubDate = "";
            ///call backend set date service
            MyConfService.updateSubmissionDate(data,$scope.currentConferenceId).then(function (Object) {
                $state.go($state.current, {}, {reload: true});
            })
        }
    };
    $scope.revDate = function(data) {
        var date = new Date();
        var presentDate = date.toJSON();
        if(data < presentDate){$scope.messageReviewDate="Review end date can not be set to past";}
        else if(data < $scope.submissionDate){$scope.messageReviewDate="Review end date must fall after submission end date";}
        else if(data>presentDate && data>$scope.submissionDate){$scope.messageReviewDate="";
            ///call backend set date service
            MyConfService.updateReviewDate(data,$scope.currentConferenceId).then(function (Object) {
                $state.go($state.current, {}, {reload: true});
            })
        }
    };

    MyConfService.getAuthors($scope.currentConferenceId).then(function(object){
        angular.forEach(object.data,function(type,index){
            angular.forEach(type.conferenceSubmissions,function(value,index){
                if(value.submittedBy!=null){
                    $scope.authors.push(value.submittedBy)}
            })
        });
        console.log($scope.authors);
        console.log("heheh");
    });

    $scope.reviewerFilter = function(auth,email) {
        return (auth!= email );
    };

    $scope.autoAssign=function(){
        $scope.users=[];
        angular.forEach($scope.bigData,function(data1,index){
          angular.forEach(data1.conferenceSubmissions,function(data2,index){
              if(data2.submissionStatus=="complete" ){
                  $scope.users.push(data2.submittedBy.email);
              }
          })
        });
        console.log($scope.users);
        if($scope.users.length!=1){
        var randomNumber=$scope.random(1,$scope.users.length);
        for(var i=0;i<$scope.users.length;i++) {
            var position=(i+randomNumber)%$scope.users.length;
            $scope.formData.email[$scope.users[i]]=$scope.users[position];
        }
        }
    };
    //this function generates a random value; used in auto assign algo
    $scope.random=function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    $scope.assign= function(reviewer,subId){
        //is to get Id associated with author email.

        console.log(reviewer);
        console.log(subId);

        angular.forEach($scope.authors,function(author,index){
            if(author.email==reviewer){
                $scope.reviewerId=author._id;
                console.log("Success");
                }
        });
        if($scope.reviewerId!=""){
        MyConfService.addReviewer($scope.currentConferenceId,subId,$scope.reviewerId).then(function(object){
            console.log(object);
            $scope.bigData=object.data;
            $scope.setStatus();
        });
        }
    };

});