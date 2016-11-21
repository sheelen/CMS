var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

// Verify user account
router.get('/verify',function (req,res) {

  host=req.get('host');
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
    console.log("Domain is matched. Information is from Authentic email");
    console.log(req.query.id);

    User.update({email:req.query.id},{$set:{'verifiedStatus': 'verified'}},function(err,body){
      if(err)
      {
        console.log("some error");
      }
      else
      {
        res.redirect("/");
      }

    })

  }
  else
  {
    res.end("<h1>Request is from unknown source");
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
