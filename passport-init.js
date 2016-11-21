var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "teamninetk@gmail.com",
        pass: "admin123!"
    }
});

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not

            User.findOne({ email :  username },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('User Not Found with username ' + username);
                        return done(err);
                    }
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false);
                    }
                    // User is not verified with email
                    if(user.verifiedStatus == 'nonVerified'){
                        console.log("User has not verifies an email. Please verify");
                        return done(err);
                    }
                    // User exists but wrong password, log the error
                    if (isValidPassword(user, password)){
                        console.log('valid Password'+user);
                        req.session.user=user;
                      //  console.log(req.session);
                        return done(null, user); // redirect back to login page
                    }console.log('Password Matched '+username);
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, false);
                }
            );
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log("inside signup");
            console.log(username);

            // find a user in mongo with provided username
            User.findOne({ 'email' :  username }, function(err, user) {
                // In case of any error, return using the done method
                if (err){
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists with username: '+username);
                    return done(null, false);
                } else {
                    // if there is no user, create the user
                    var hashpassword = createHash(password);
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.email = username;
                    newUser.password = hashpassword; //hash created from password
                    newUser.firstName = req.body.firstname;
                    newUser.lastName = req.body.lastname;
                    newUser.institution = req.body.institution;
                    newUser.postalAddress = req.body.postaladdress;
                    newUser.comment={userComment:"",adminComment:""};
                    newUser.city = req.body.city;
                    newUser.state = req.body.state;
                    newUser.country = req.body.country;
                    newUser.privilege = "normal";
                    newUser.status = "granted";
                    newUser.verifiedStatus = "nonVerified";

                    //send email for verification
                    host=req.get('host');
                    console.log( host);
                    link ="http://"+req.get('host')+"/verify?id="+newUser.email;
                    var mail = {
                        from: "teamninetk@gmail.com",
                        to: newUser.email,
                        subject: "TK Project Verification",
                        html : "Hello User,Please click on the following link to verify your email account for the tk project.<a href="+link+">Click here to verify your account</a>"
                    }
                    smtpTransport.sendMail(mail, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }

                    });
                    //newUser.created_on= Date.now;
                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log(newUser.username + ' Registration successful');
                        return done(null, newUser);
                    });
                }
            });
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};