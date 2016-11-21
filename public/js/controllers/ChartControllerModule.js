angular.module('ChartControllerModule',[]).controller('ChartController',function($scope,$location,$state,$window,$rootScope,ConfService,submissionService,ReviewService) {
    // var dataFromServer = //ServiceHit

    var chartData = [];
    var drilldownData={};

// Chart for Conferences
   var hchart = new Highcharts.Chart({
     lang :{
       noData : "No Data to display!"
     },
        chart:{
            renderTo : "container",
            type : "pie"
        },
        credits: {
            enabled: false
        },title: {
            text: "My Conferences"
        }



   });
// Chart for submission Status
function createSubmissionChart(dataOfConference,nameOfConference,div){
    console.log("dataOfConference is::");
    console.log(dataOfConference);
    var hchart_submission = new Highcharts.Chart({
        lang :{
            noData : "No Data to display!"
        },
        chart:{
            renderTo : "submissionStatus",
            type : "bar"
        },
        credits: {
            enabled: false
        },title: {
            text: "Submission Status of "+nameOfConference
        },xAxis: {
            categories: ['Complete', 'Incomplete','Accepted','Rejected','Closed'],
            title: {
                text: null
            }
        },series :[{
            name : nameOfConference,
            data : dataOfConference
        }]
        
    });

}


    // Chart for review Status
    function createReviewChart (dataOfConference,nameOfConference,div) {
        console.log("dataOfConference is::");
        console.log(dataOfConference);
        var hchart_submission = new Highcharts.Chart({
            lang: {
                noData: "No Data to display!"
            },
            chart: {
                renderTo: "reviewStatus",
                type: "bar"
            },
            credits: {
                enabled: false
            }, title: {
                text: "Review Status of " + nameOfConference
            }, xAxis: {
                categories: ['Strong Accept', 'Accept','Borderline','Reject','Strong Reject','Not Evaluated'],
                title: {
                    text: null
                }
            }, series: [{
                name: nameOfConference,
                data: dataOfConference
            }]

        });
    }


    ConfService.ListConferenceChair($rootScope.user._id).then(function(conf){
        //console.log(conf.data);
        console.log($scope.user);
        for(var i=0;i<conf.data.length;i++)
        {
            //console.log(conf.data[i]);
            if(conf.data[i].createdBy == $scope.user._id)
            {
            console.log(conf.data[i]);
                var conferenceId = conf.data[i]._id;
                var conferenceName= conf.data[i].conferenceTitle
           //     console.log(conferenceId);

                chartData.push({name: conf.data[i].conferenceTitle,id : conferenceId,y : 1,drilldown: false/*conf.data[i].conferenceMembers.length*/})

            }
        }
        //console.log(chartData)
        hchart.addSeries({name : "conference ",data:chartData ,
            point:{
            events:{
                click: function (event) {
                    var seriesName =this.name;
                    submissionService.getAllSubmissionCountByConferenceId(this.id,this.name).then(function(dataFrmServer){
                        var data=dataFrmServer.data;
                        console.log(dataFrmServer);
                        $("#submissionStatus").empty();
                        createSubmissionChart([{y:data.complete,color:"#33cc33"},{y:data.incomplete,color:"#ff0000"},{y:data.accepted,color:"#ccff66"},{y:data.rejected,color: "#000000"},{y:data.closed}],seriesName,"submissionStatus");

                    });

                    ReviewService.getReviewStatusByConferenceId(this.id,this.name).then(function(dataFrmServer){
                        console.log(dataFrmServer);
                        var data=dataFrmServer.data;
                        $("#reviewStatus").empty();
                        createReviewChart([{y:data.strongaccept,color:"#00cc00"},{y:data.accept,color:"#99ff66"},{y:data.borderline,color:"#ffff00"},{y:data.reject,color:"#ff5c33"},{y:data.strongreject,color:"#ff0000"},{y:data.notevaluated,color:"#999966"}],seriesName,"reviewStatus")
                    });


                }
            }
        }});
    });






});
