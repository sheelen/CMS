var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

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
router.use('/new', isAuthenticated);
router.use('/remove', isAuthenticated);
router.use('/request', isAuthenticated);

router.route('/request')
    .post(function(req,res){
        console.log(req.body.userid);
        console.log(req.body.comments);
        User.update({'_id':req.body.userid},{$set:{"comment.userComment":req.body.comments, 'status': 'pending'}},function(err,body){
            if(err){console.log("some error while requesting privilege");}
            else{console.log("success");
                res.send({message: "success"});}
        })
    });

router.route('/getUser')
    .post(function(req,res){
        User.findOne({'_id':req.body.userId},function(err,body){
            if(err){console.log("not able to find user");}
            else{console.log("success");
                res.send(body);}
        })
    });

router.route('/new')
    .post(function(req, res){
        console.log('Accept... userid'+ req.body.userid);
        User.update({'_id':req.body.userid},{$set:{'status': 'granted', 'privilege': 'chair'}},function(err,body){
            if(err){console.log("some error while accepting privilege");}
            else{console.log("success accepting");
                res.send({message: "success accepting"});}
        })

    })
    .put(function(req, res){
        console.log('**************************+Reject... userid'+ req.body.comments);
        User.update({'_id':req.body.userid},{$set:{'comment.adminComment': req.body.comments, 'status': 'removed', 'privilege': 'normal'}},function(err,body){
            if(err){console.log("some error while rejecting privilege");}
            else{console.log("success rejecting");
                res.send({message: "success rejecting"});}

        })
    })
    .get(function(req,res){
        console.log('Before Find function');
        User.find({status: "pending"},function(err,user){
            console.log('Inside Find function');
            if(err){
                return res.send(500, err);
            }
            return res.send(200, user);
        })
    });

router.route('/remove')
    .get(function(req,res){
        console.log('Before Find function');
        User.find({status: "granted", privilege: "chair"},function(err,user){
            console.log('Inside Find function');
            if(err){
                return res.send(500, err);
            }
            return res.send(200, user);
        })
    })
    .put(function(req, res){
        console.log('Reject... userid'+ req.body.userid);
            User.update({'_id':req.body.userid},{$set:{'status': 'removed', 'privilege': 'normal'}},function(err,body){
                if(err)
                    {console.log("some error while removing privilege");}
                else{console.log("success removing");
                    res.send({message: "success removing"});}

            })
    });

module.exports = router;