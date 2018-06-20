//** 3rd Party **//
const Validate = require("express-validation");

//** External Dependencies **//
const Controller = require("../Controllers");
const validations = require("./validations");

//** exporting all routes in a function **//
module.exports = function(app) {

  app.post("/verifyEmail", Validate(validations.verifyEmailPostSchema), async (req, res) => {
    /*
      req.body:{
        email:'xyz@gmail.com',
        otp:'******'
      }
    */
    Controller.otpController.verifyEmailOTP(req.body)
      .then(data => {
        res.redirect('/success');
      })
      .catch(err => {
        res.status(401).send(err);
      });
  });

  app.post("/verifyPhone", Validate(validations.verifyOtpPostSchema), async (req, res) => {
    /*
      req.body:{
        phoneNo:9041306219,
        otp:'******'
      }
    */
    Controller.otpController.verifySmsOTP(req.body)
      .then(data => {
        res.redirect('/success');
      })
      .catch(err => {
        res.status(401).send(err);
      });
  });

  app.post("/enableDoubleAuth", Validate(validations.loginSchema), async (req, res) => {
    /*
      req.body:{
        email: 'xyz@gmail.com',
        password: '********',
      }
    */
    Controller.logInController.doubleAuthEnable(req.body, function(err, result){
      if(err){
        res.status(401).send(err)
      } else {
        res.status(200).send(result)
      }
    })
  })
};
