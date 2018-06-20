//** 3rd Party **//
const SES = require("node-ses");
require('dotenv').config();
const twilioClient = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// internal Dependencies
let client = SES.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  amazon: process.env.AWS_REGION
});

// send SMS to the mobile number
const sendSMS = payload => {
  /*
    payload:{
      message:'your OTP is ******',
      phoneNo: '9041306219'
      //can send OTP only to this number because this number is verified with twilio account
      //this is the limitation of trial account
    }
  */
  return new Promise((resolve, reject) => {
    twilioClient.messages
      .create({
        body: payload.message,
        from: "+17159532157", // this is the number provided my twilio for sending sms
        to: "+91" + payload.phoneNo
      })
      .then(function(message) {
        resolve(message);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

//* * Verify mobile no **//
const sendEmail = async payload => {
  /*
    payload:{
      message: 'your OTP is ******',
      type: 'actual subject comes here',
      email: 'xyz@gmail.com'
    }
  */
  return new Promise((resolve, reject) => {
    client.sendEmail(
      {
        to: payload.email,
        /*
          can send email from only verified email
          this email is verified email on AWS-SES
        */
        from: "kunalsinghpal377@gmail.com",
        subject: payload.type,
        message: payload.message
      },
      function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

module.exports = {
  sendSMS,
  sendEmail
};
