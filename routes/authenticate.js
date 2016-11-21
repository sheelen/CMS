var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure1', function(req, res){

        //example of session usage
        if ( !req.session.views){
            req.session.views = 1;
            req.session.datasample = {role: "normal",status:"granted"};
        }else{
            req.session.views += 1;
        }
        console.log("unsuccesful login : "+req.session.views);
        console.log("unsuccesful login : "+req.session.datasample.role);

            res.send({state: 'failure', user: null, message: "Invalid username or password or verify your email address:Please try again"});
    });
    router.get('/failure2', function(req, res){
        res.send({state: 'failure', user: null, message:  "User already exists for this email" });
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/users/success',
        failureRedirect: '/users/failure1'
    }));

    //sign up
    router.post('/register', passport.authenticate('signup', {
        successRedirect: '/users/success',
        failureRedirect: '/users/failure2'
    }));

    router.get('/loggedin', function(req,res) {
       // console.log(req.session.user);
        res.send(req.isAuthenticated() ? req.session.user : '0');
    });

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        req.session.destroy(function(err){
           console.log(err);
        });
        res.send('200');
    });

    return router;

};