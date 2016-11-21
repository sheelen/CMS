var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var multer = require('multer');
var User = mongoose.model('User');
var Conference = mongoose.model('Conference');
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

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
       // cb(null, req.session.lastsubmissionid+ '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        cb(null, req.session.lastsubmissionid+ '.pdf')
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

router.use('/upload', isAuthenticated);
router.use('/getoldinfo',isAuthenticated);
router.use('/uploadinfo',isAuthenticated);
router.use('/getConfObject',isAuthenticated);
router.use('/getAllSubmissionCountByConferenceId',isAuthenticated);

router.route('/upload')
    .post(function(req,res){
        console.log("from upload");
        console.log(req.session.lastsubmissionid);
        upload(req,res,function(err){
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }
            res.json({error_code:0,err_desc:null});
        })
    });
router.route('/getConfObject')
    .post(function(req,res){
        Conference.findOne({'_id':req.body.confId}).populate({path:'conferenceMembers',model:'User',match:{_id:{$ne:req.body.userId}}}).exec(function(err,data){
            if(data){

                res.json(data);
            }
        });
    });

router.route('/getoldinfo')
    .post(function(req,res) {
        Submission.findOne({'submittedBy':req.body.user._id,'confID':req.body.conference._id}).populate({path:'reviewID',model:'Review'}).exec(function(err,data1){
            if (data1) {
                res.json(data1);
            }else{
                Submission.findOne({'coAuthors':req.body.user._id,'confID':req.body.conference._id}).populate({path:'reviewID',model:'Review'}).exec(function(err,data1){
                    if (data1) {
                        res.json(data1);
                    }

                });
            }
        });
    });

router.route('/uploadinfo')
    .post(function(req,res){
        console.log(req.body.user._id);
        console.log(req.body.conference._id);
        Submission.findOne({'submittedBy':req.body.user._id,'confID':req.body.conference._id},function(err,data1){
            if(data1){
                req.session.lastsubmissionid=data1._id;
                Submission.update({'_id':data1._id},req.body.submission,function(err,body){
                    if(err){}
                    else{
                        console.log("from update");
                        console.log(data1);
                        if(req.body.submission.submissionStatus =='complete') {
                            console.log("inside updated submission update");
                            var mail = {
                                from: "teamninetk@gmail.com",
                                to: req.body.user.email,
                                subject: "TK Project Submission Status",
                                html: "Hello User, You have successfully submitted the paper for review."
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
                        if(req.body.submission.submissionStatus =='closed') {
                            console.log("inside updated submission update");
                            var mail = {
                                from: "teamninetk@gmail.com",
                                to: req.body.user.email,
                                subject: "TK Project Submission Status",
                                html: "Hello User, You have successfully withdrawn the paper."
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
                        res.json(body);}
                });
            }else{
                var submission = new Submission(req.body.submission);
                submission.save(function(err,data2){
                    if (err){
                        console.log('Error in Saving submission: '+err);
                        throw err;
                    }else{
                        console.log("from save");
                        console.log(data2);
                        User.update({'_id':req.body.user._id},{$push: {'mySubmission':data2._id}},function(err,data){
                            if(err)
                                throw(err);
                            else{
                                Conference.update({'_id':req.body.conference._id},{$push: {'conferenceSubmissions':data2._id}},function(err,data){
                                    if(err)
                                        throw(err)
                                    else{

                                        req.session.lastsubmissionid=data2._id;
                                        console.log("submission saved successfully");
                                        if(req.body.submission.submissionStatus =='complete') {
                                            console.log("After final submission");
                                            var mail = {
                                                from: "teamninetk@gmail.com",
                                                to: req.body.user.email,
                                                subject: "TK Project Submission Status",
                                                html: "Hello User, You have successfully submitted the paper for review"
                                            }
                                            smtpTransport.sendMail(mail, function (error, response) {
                                                console.log("Inside send mail...........");
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log("Message sent: " + response.message);
                                                }

                                            });
                                        }
                                        if(req.body.submission.submissionStatus =='closed') {
                                            console.log("inside updated submission update");
                                            var mail = {
                                                from: "teamninetk@gmail.com",
                                                to: req.body.user.email,
                                                subject: "TK Project Submission Status",
                                                html: "Hello User, You have successfully withdrawn the paper."
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
                                        res.send({message: "submission saved successfully"});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    });

router.route('/getAllSubmissionCountByConferenceId')
    .post(function(req,res) {
        console.log(" Inside getAllSubmissionCountByConferenceId!!!")
        Submission.find({'confID':req.body.conferenceId},function(err,submissionList){
            var completeCount=0,incompleteCount=0,acceptedCount=0,rejectedCount=0,closedCount=0;
            console.log(submissionList);
            if (submissionList) {
                for(var i=0;i<submissionList.length;i++){
                    if(submissionList[i].submissionStatus=="complete"){
                        completeCount++;
                    }else if(submissionList[i].submissionStatus=="accepted"){
                        acceptedCount++;
                    }else if(submissionList[i].submissionStatus=="rejected"){
                        rejectedCount++;
                    }else if(submissionList[i].submissionStatus=="closed"){
                        closedCount++;
                    }
                    else{
                        incompleteCount++;
                    }
                }

                res.send({complete :completeCount,incomplete: incompleteCount,accepted: acceptedCount,rejected:rejectedCount,closed:closedCount});
            }else{
                res.send([]);
            }
        });
    });

module.exports = router;