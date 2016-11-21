angular.module('SubmissionControllerModule',['ngFileUpload']).controller('SubmissionController',function($scope,$location,submissionService,$state,$stateParams,$rootScope,Upload){
    console.log("submission controller");
    $scope.message="";
    $scope.alreadysubmitted=false;
    $scope.enddateover=false;
    $scope.submitted=false;
    $scope.notauthor=false;
    $scope.sub={};
    $scope.sub.submissionStatus="Not Submitted";
    $scope.review={};
    $scope.review.reviewStatus="incomplete";
    $scope.review.reviewerExpertise="";
    $scope.review.summary="";
    $scope.review.strongPoints="";
    $scope.review.weakPoints="";
    $scope.review.comments="";
    $scope.review.overallEvaluation="Not Evaluated";

   // var conference = $stateParams.selectedconf;
   console.log($stateParams.confId);

    submissionService.getConfObject($stateParams.confId,$rootScope.user._id).then(function(datafromserver){
        console.log("insideget confid");
        $scope.conference = datafromserver.data;
        $scope.coauthors=$scope.conference.conferenceMembers;
        submissionService.getoldinfo($scope.conference,$rootScope.user).then(function(datafromserver){
                                console.log(datafromserver.data);
                                console.log("inside then getoldinfo");
                                if(datafromserver.data && datafromserver.data!=null){
                                    console.log(datafromserver.data);
                                    $scope.sub=datafromserver.data;
                                                                    if($scope.sub.uploadStatus=="complete"){
                                                                        $scope.previousdoc=true;
                                                                    }
                                                                    if($scope.sub.submittedBy!=$rootScope.user._id){
                                                                        $scope.notauthor=true;
                                                                    }

                                                                    if(datafromserver.data.submissionStatus=="complete"){
                                                                        $scope.submitted=true;
                                                                    }else if(datafromserver.data.submissionStatus=="incomplete" ||datafromserver.data.submissionStatus=="closed"){
                                                                        $scope.submitted=false;
                                                                    }
                                                                    if(datafromserver.data.reviewID){
                                                                        console.log("old data available ");
                                                                        $scope.review=datafromserver.data.reviewID;
                                                                    }
                                }

            });

        var subenddate = new Date($scope.conference.submissionEndDate);
        var currentdate = new Date();
        if(currentdate<subenddate){
            console.log("end date not over");
            $scope.enddateover=false;

        }else{
            console.log("end date invalid");
            $scope.enddateover=true;
        }
    });


    $rootScope.isRole= function(role){
        // console.log(role);
        if(role==$rootScope.user.privilege){
            return true;
        }else{
            return false;
        }
    };

    $scope.saveSubmission = function(){
        var subenddate = new Date($scope.conference.submissionEndDate);
        var currentdate = new Date();
        if(currentdate<subenddate){
            $scope.enddateover=false;
            var submission = {
                        submissionTitle: $scope.sub.submissionTitle,
                        coAuthors: $scope.sub.coAuthors,
                        abstract: $scope.sub.abstract,
                        keywords: $scope.sub.keywords,
                        filePath: "/uploads/",
                        submittedBy: $rootScope.user._id,
                        confID: $scope.conference._id,
                        submissionStatus: "incomplete"
            }
        if($scope.sub && $scope.sub.uploadStatus=="complete"){
            submission.uploadStatus="complete";
        }else{
            if($scope.sub.uploadFile){
                submission.uploadStatus="complete";
            }else{
                submission.uploadStatus="incomplete";
            }
        }
        submissionService.uploadinfo($scope.conference,$rootScope.user,submission).then(function(datafromserver){
                        console.log("returned after updating info");
                        $scope.message="Saved Successfully";
                        $scope.progress="";
                        if ($scope.sub.uploadFile) {
                                    Upload.upload({
                                                                           url: 'submission/upload',
                                                                           data: {file: $scope.sub.uploadFile}
                                                                               }).then(function (resp) {
                                                                                 console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);


                                                                                }, function (resp) {
                                                                                console.log('Error status: ' + resp.status);
                                                                                }, function (evt) {
                                                                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                                                                $scope.progress='Upload: ' + progressPercentage + '% ';
                                                                                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                                     });
                                }
        });





        }else{
            $scope.enddateover=true;
        }

    }

    $scope.withdrawSubmission = function(){
        var subenddate = new Date($scope.conference.submissionEndDate);
                var currentdate = new Date();
                if(currentdate<subenddate){
                    $scope.enddateover=false;
                    var submission = {
                                submissionTitle: $scope.sub.submissionTitle,
                                coAuthors: $scope.sub.coAuthors,
                                abstract: $scope.sub.abstract,
                                keywords: $scope.sub.keywords,
                                filePath: "/uploads/",
                                submittedBy: $rootScope.user._id,
                                confID: $scope.conference._id,
                                submissionStatus: "closed"
                    }
                submissionService.uploadinfo($scope.conference,$rootScope.user,submission).then(function(datafromserver){
                                console.log("returned after updating info");
                                $scope.message="Withdrawn Successfully";
                                $scope.progress="";
                                $scope.submitted = false;
                });

                }else{
                    $scope.enddateover=true;
                }

    }

    $scope.uploadDoc = function(){

  //  submissionService.getConfObject($stateParams.confId,$rootScope.user._id).then(function(datafromserver){
         //   $scope.conference = datafromserver.data;

    var subenddate = new Date($scope.conference.submissionEndDate);
    var currentdate = new Date();
    if(currentdate<subenddate){
    $scope.enddateover=false;
    var submission = {
            submissionTitle: $scope.sub.submissionTitle,
            coAuthors: $scope.sub.coAuthors,
            abstract: $scope.sub.abstract,
            keywords: $scope.sub.keywords,
            filePath: "/uploads/",
            submittedBy: $rootScope.user._id,
            confID: $scope.conference._id,
            uploadStatus:"complete",
            submissionStatus: "complete"
    }
        if ($scope.sub.uploadFile) {
            submissionService.uploadinfo($scope.conference,$rootScope.user,submission).then(function(datafromserver){
                    console.log("returned after updating info");

                    Upload.upload({
                                       url: 'submission/upload',
                                       data: {file: $scope.sub.uploadFile}
                                           }).then(function (resp) {
                                             console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                                             $scope.message="Submitted Successfully";
                                             $scope.submitted=true;

                                            }, function (resp) {
                                            console.log('Error status: ' + resp.status);
                                            }, function (evt) {
                                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                            $scope.progress='Upload: ' + progressPercentage + '% ';
                                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                                 });

                    });

              }
    }else{
        $scope.enddateover=true;
    }
   // });
    }

});