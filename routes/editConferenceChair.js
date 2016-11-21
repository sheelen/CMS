var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var Conference = mongoose.model('Conference');
var Submission = mongoose.model('Submission');
var Review = mongoose.model('Review');
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
router.use('/getAuthors', isAuthenticated);
router.use('/assignReviewer', isAuthenticated);
router.use('/updateDate', isAuthenticated);
router.use('/close', isAuthenticated);
router.use('/submission', isAuthenticated);


router.route('/getAuthors')
    .get(function(req,res){
        Conference.find({'_id':req.param('confId')})
           .populate({
                path: 'conferenceSubmissions',
                match:{'submissionStatus': "complete"},
                populate: {path: 'submittedBy',
                select: '_id email'
                }
            }).exec(function(err,data){
                if(err){console.log('error: '+err);throw err;}
                if(data){res.json(data);}
                })
    });

router.route('/updateDate/submission')
    .post(function(req,res) {
        console.log(req.body.subDate);
        console.log(req.body.confId);
        Conference.update({'_id': req.body.confId}, {$set: {'submissionEndDate': req.body.subDate}}, function (err, body) {
            if (err) {
                console.log("some error while updating submission end date");
            }
            if(body) {
                res.send({message: "submission deadline updated"});
            }

        })
    });

router.route('/updateDate/review')
    .post(function(req,res) {
        console.log(req.body.revDate);
        console.log(req.body.confId);
        Conference.update({'_id': req.body.confId}, {$set: {'reviewEndDate': req.body.revDate}}, function (err, body) {
            if (err) {
                console.log("some error while updating submission end date");
            }
            if(body) {
                res.send({message: "review deadline updated"});
            }

        })
    });

router.route('/close/submission')
    .post(function(req,res) {
 var date= new Date();
        var currentDate=date.toJSON();
        console.log(req.body.confId);
        Conference.update({'_id':req.body.confId},{$set:{'submissionEndDate':currentDate}}, function(err,body){
            if (err) {
                console.log("some error while closing submission");
            }
            if(body) {
                res.send({message: "submission successfully closed"});
            }
        })
    });
router.route('/close/review')
    .post(function(req,res) {
        var date= new Date();
        var currentDate=date.toJSON();
        console.log(req.body.confId);
        Conference.update({'_id':req.body.confId},{$set:{'reviewEndDate':currentDate}}, function(err,body){
            if (err) {
                console.log("some error while closing review");
            }
            if(body) {
                console.log(body);

                res.send({message: "review successfully closed"});
            }
        })
    });

router.route('/submission/accept')
    .post(function(req,res) {
        console.log(req.body.subId);
        console.log(req.body.userId);
        Submission.update({'_id':req.body.subId},{$set:{'submissionStatus':"accepted"}},function(err,body){
            if (err) {
                console.log("some error while accepting submission");
            }
            if(body) {

                 console.log("inside submission accept");
                 var mail = {
                 from: "teamninetk@gmail.com",
                     to: req.body.userId,
                 subject: "TK Project Submission Status",
                 html: "Hello User, Your submission has been accepted successfully."
                 }
                 smtpTransport.sendMail(mail, function (error, response) {
                 console.log("Inside send mail.");
                 if (error) {
                 console.log(error);
                 } else {
                 console.log("Message sent: " + response.message);
                 }

                 });

                res.send({message: "submission accepted successfully"});
            }
        });
    });
router.route('/submission/reject')
    .post(function(req,res) {
        console.log(req.body.subId);
        console.log(req.body.userId);
        Submission.update({'_id':req.body.subId},{$set:{'submissionStatus':"rejected"}},function(err,body){
            if (err) {
                console.log("some error while rejecting submission");
            }
            if(body) {
                console.log("inside submission reject");
                var mail = {
                    from: "teamninetk@gmail.com",
                    to: req.body.userId,
                    subject: "TK Project Submission Status",
                    html: "Hello User, Your submission has been rejected."
                }
                smtpTransport.sendMail(mail, function (error, response) {
                    console.log("Inside send mail.");
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }

                });
                res.send({message: "submission rejected successfully"});
            }
        });
    });
router.route('/submission/withdraw')
    .post(function(req,res) {
        console.log(req.body.subId);
        console.log(req.body.userId);
        Submission.update({'_id':req.body.subId},{$set:{'submissionStatus':"closed"}},function(err,body){
            if (err) {
                console.log("some error while rejecting submission");
            }
            if(body) {
                console.log("inside submission withdraw");
                var mail = {
                    from: "teamninetk@gmail.com",
                    to: req.body.userId,
                    subject: "TK Project Submission Status",
                    html: "Hello User, Your submission has been withdrawn."
                }
                smtpTransport.sendMail(mail, function (error, response) {
                    console.log("Inside send mail.");
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }

                });
                res.send({message: "submission withdrawn successfully"});
            }
        });
    });

router.route('/assignReviewer')
    .post(function(req,res){
        console.log(req.body.confId);
        console.log(req.body.subId);
        console.log(req.body.reviewerId);
        var currDate = new Date();
        var jasonDate = currDate.toJSON();
        console.log(jasonDate);
        Conference.findOne({'_id':req.body.confId,'reviewEndDate':{$gte:jasonDate}}, function(err,conf){
            if(err){
                return res.send(500, err);
            }
            if(conf){
                var newReview = new Review();
                newReview.reviewerExpertise = "";
                newReview.overallEvaluation ="NotEvaluated";
                newReview.summary="";
                newReview.weakPoints="";
                newReview.comments="";
                newReview.reviewStatus="incomplete";
                newReview.submissionID=req.body.subId;
                newReview.reviewerID=req.body.reviewerId;
                newReview.conferenceID=req.body.confId;
                newReview.save(function(err,revObject) {
                    if (err){
                        console.log('Error in creating Review: '+err);
                        throw err;
                    }if(revObject){
                        console.log("Review successfully created"+revObject._id);
                        Submission.update({'_id':req.body.subId},{$set:{'reviewID':revObject._id}},function(err,data){
                           if(data){
                               Conference.find({'_id':req.body.confId})
                                   .populate({
                                       path: 'conferenceSubmissions',
                                       populate: {path: 'coAuthors submittedBy reviewID',
                                           populate:{path:'reviewerID',select:'firstName lastName email institution country city postalAddress'}
                                       }
                                   }).exec(function(err,data){
                                   if(err){console.log('error: '+err);throw err;}
                                   if(data){res.json(data);}
                               })
                           }
                        });
                    }
                });
            }
            else return res.send({message: "review ended"})
        })
    });

module.exports = router;