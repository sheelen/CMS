var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

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
router.use('/data', isAuthenticated);
router.use('/password', isAuthenticated);

router.route('/data')
    .post(function(req,res){
        console.log(req.body.firstName);
        console.log(req.body.id);
        User.findOneAndUpdate({'_id': req.body.id},{$set: {"firstName": req.body.firstName, "lastName": req.body.lastName, "institution": req.body.institution,"city":req.body.city,"state":req.body.state,"country":req.body.country}}).exec(function(err,User){
            if(err){
                console.log(err);
            }
            else{
                res.send(User);
            }
        });
    })
    .get(function(req,res){
        console.log("inside get method");
        console.log(req.param('id'));
        User.findOne({_id: req.param('id')}, function (err,User) {
            res.send(User);
        });
    });

router.route('/password')
    .post(function(req,res){
        var id=req.body.userId;
        User.findById(id,function(err,value){
            if(err){
                res.send(err);
            }
            if(isValidPassword(value,req.body.oldPass)){
                User.findByIdAndUpdate(id, {$set:{password: createHash(req.body.newPass)}},function(err,back){
                    if(err){
                        res.send(err);
                    }else
                        res.send({message: "1"});
                })
            }
            else{
                res.send({message: "2"});
            }
        })
    });

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};
module.exports = router;