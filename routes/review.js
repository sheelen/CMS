var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var Conference = mongoose.model('Conference');
var Review = mongoose.model('Review');
var Submission = mongoose.model('Submission');
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "teamninetk@gmail.com",
        pass: "admin123!"
    }
});

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()){
        return next();
    }
    res.send('401');
}

router.use('/getDetails', isAuthenticated);
router.use('/addReview',isAuthenticated);
router.use('/getReviewStatusByConferenceId',isAuthenticated);


router.route('/getDetails')
    .get(function(req,res) {
        console.log(req.param('condId'));
        Review.findOne({'conferenceID':req.param('confId'),'reviewerID':req.param('userId')}).populate({path:'conferenceID submissionID'}).exec(function(err,data1){
            if (data1) {
                console.log(data1);
                res.json(data1);
            }else{
                res.send("notassigned");
            }
        });
    });



router.route('/addReview')
    .post(function(req,res) {
        var currentDate=new Date();
        var currDate=currentDate.toJSON();
        console.log(req.body.email);
        console.log(currDate);

        Conference.find({'_id':req.body.conferenceID,'reviewEndDate':{$gte:currDate},'submissionEndData':{$lte:currDate}},function(err,data){
            if(data){
                Review.findOneAndUpdate({'conferenceID':req.body.review.conferenceID,'submissionID':req.body.review.subId},{$set:{
                    reviewerExpertise:req.body.review.reviewerExpertise,
                    comments:req.body.review.comments,
                    summary:req.body.review.summary,
                    strongPoints:req.body.review.strongPoints,
                    weakPoints: req.body.review.weakPoints,
                    reviewStatus:"complete",
                    overallEvaluation:req.body.review.overallEvaluation
                }},{returnNewDocument : true},function(err,data) {

                    if(data){
                        console.log("updating");
                        console.log(data);
                        console.log(data.reviewStatus);
                        if(data.reviewStatus =='complete') {
                            console.log("inside review status");
                            var mail = {
                                from: "teamninetk@gmail.com",
                                to: req.body.review.email,
                                subject: "TK Project reviewer assigned",
                                html: "Hello User,<br><br> You have successfully submitted your review ."
                            }
                            smtpTransport.sendMail(mail, function (error, response) {
                                console.log("Inside send mail.");
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Message sent: " + response.message);
                                }

                            });
                        }

                        res.send(data)}
                    if(err){res.send.err}
                });

            }
            else res.send("no conf exist");
        });



        });
               /* Review.update({'conferenceID':req.body.review.conferenceID,'submissionID':req.body.review.subId},{$set:{
                    reviewerExpertise:req.body.review.reviewerExpertise,
                    comments:req.body.review.comments,
                    summary:req.body.review.summary,
                    strongPoints:req.body.review.strongPoints,
                    weakPoints: req.body.review.weakPoints,
                    reviewStatus:"complete",
                    overallEvaluation:req.body.review.overallEvaluation
                }},function(err,data){
                    if(data){
                        console.log("updating");
                        console.log(data);
                        console.log(data.reviewStatus);
                        if(data.reviewStatus =='complete') {
                            console.log("inside review status");
                            var mail = {
                                from: "teamninetk@gmail.com",
                                to: req.body.user.email,
                                subject: "TK Project reviewer assigned",
                                html: "Hello User, You ."
                            }
                            smtpTransport.sendMail(mail, function (error, response) {
                                console.log("Inside send mail.");
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Message sent: " + response.message);
                                }

                            });
                        }

                        res.send(data)}
                    if(err){res.send.err}
                });

            }
            else res.send("no conf exist");
        });*/



router.route('/getReviewStatusByConferenceId')
    .post(function(req,res) {
        console.log("Conference id is :::::::::::::::::"+req.param('conferenceId'));
        Review.find({"conferenceID":req.param('conferenceId')},function (error,reviewList) {
            console.log("*******************");
            console.log(reviewList);
            console.log("*******************");
            var strongaccept=0,accept=0,borderline=0,reject=0,strongreject=0,NotEvaluated=0;
            if(reviewList){
                for(var i=0;i<reviewList.length;i++){
                    if(reviewList[i].overallEvaluation=="Strong Accept")
                        strongaccept++;
                    else if(reviewList[i].overallEvaluation=="Weak Accept")
                        accept++;
                    else if(reviewList[i].overallEvaluation=="Borderline")
                        borderline++;
                    else if(reviewList[i].overallEvaluation=="Weak Reject")
                        reject++;
                    else if(reviewList[i].overallEvaluation=="Strong Reject")
                        strongreject++;
                    else NotEvaluated++;

                }
                res.send({strongaccept:strongaccept,accept:accept,borderline:borderline,reject:reject,strongreject:strongreject,notevaluated:NotEvaluated});
            }else{
                res.send([]);
            }

        })
    });


module.exports = router;
