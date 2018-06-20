/** External Dependency **/
const Controller = require("../Controllers");

// dotenv for storing the api keys in environment variables
require("dotenv").config();

/** Passport **/
const passport = require('passport');
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id)
});


/** Google signUP **/
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: process.env.googleCallbackURL
    },
    function(token, tokenSecret, profile, done) {

        // this is the form of data we want to save in DB
        let dataToSave = {
            fullName: profile.displayName,
            googleAccessToken: token,
            googleUserId: profile.id,
            email: profile.emails[0].value,
            googleLogin: true
        }

        Controller.signUpController.socialSignUp(dataToSave, function(err, result) {
            if (err) {
                return done(err)
            } else {
                return done(null, result.message);
            }
        })
    }
));


/** facebook Signup **/
var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: process.env.facebookClientID,
        clientSecret: process.env.facebookClientSecret,
        callbackURL: process.env.facebookCallbackURL,
        profileFields: ['id', 'displayName', 'birthday', 'email']
    },
    function(accessToken, refreshToken, profile, done) {     
        

        let temp;
        /*
           sometimes
           facebook user not have there email registered with facebook
           so we may not get the email in response so to overcome undefined error
           we are checkin these coditions
        */
        if(profile.emails){
            temp = profile.emails[0].value;
        }
        else{
            temp = null;
        }

        // this is the form of data we will save in DB
        let dataToSave = {
            fullName: profile.displayName,
            facebookAccessToken: accessToken,
            facebookUserId: profile.id,
            email: temp,
            facebookLogin: true
        }

        Controller.signUpController.socialSignUp(dataToSave, function(err, result) {
            if (err) {
                return done(err)
            } else {
                return done(null, result.message);
            }
        })
    }
));

// Routes
module.exports = function(app) {

    //Route for facebook signUp
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/success',
            failureRedirect: '/login'
        }));


    // Route for Google signUp 
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email']
        }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/success',
            failureRedirect: '/login'
        }));
    
    // route for printing the success login message
    app.get('/success', (req, res) => {
        res.send('Logged in successfully')
    })
}